import { createHmac, timingSafeEqual } from 'crypto';

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import { onContractFullySigned } from '~/lib/signature/on-contract-fully-signed';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * DocuSign Connect webhook.
 *
 * HMAC verification is optional but strongly recommended. If
 * DOCUSIGN_CONNECT_HMAC_KEY is set in the environment, the handler enforces
 * the X-DocuSign-Signature-1 header (and rejects requests without it). When
 * the var is absent we log a warning but still process the event, which
 * makes local development and demo-account testing frictionless.
 *
 * DocuSign signs the *raw body bytes* with HMAC-SHA256, so we read the body
 * as text first and compute the signature against that.
 */

function verifyHmac(
  rawBody: string,
  signatureHeader: string | null,
): { ok: boolean; reason?: string } {
  const key = process.env.DOCUSIGN_CONNECT_HMAC_KEY;
  if (!key) {
    return { ok: true, reason: 'hmac-disabled' };
  }
  if (!signatureHeader) {
    return { ok: false, reason: 'missing signature header' };
  }
  const expected = createHmac('sha256', key).update(rawBody).digest('base64');
  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(signatureHeader);
  if (expectedBuf.length !== receivedBuf.length) {
    return { ok: false, reason: 'length mismatch' };
  }
  const equal = timingSafeEqual(expectedBuf, receivedBuf);
  return equal ? { ok: true } : { ok: false, reason: 'mismatch' };
}

interface WebhookPayload {
  event?: string; // 'envelope-completed', 'envelope-declined', etc.
  data?: {
    envelopeId?: string;
    envelopeSummary?: {
      status?: string;
      externalEnvelopeId?: string;
      recipients?: {
        signers?: Array<{
          email?: string;
          status?: string;
          signedDateTime?: string;
          recipientId?: string;
        }>;
      };
    };
  };
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const sigHeader =
    req.headers.get('x-docusign-signature-1') ??
    req.headers.get('x-authorization-digest') ??
    null;

  const verify = verifyHmac(rawBody, sigHeader);
  if (!verify.ok) {
    return NextResponse.json(
      { error: `Webhook signature invalide: ${verify.reason}` },
      { status: 401 },
    );
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const envelopeId = payload.data?.envelopeId;
  const status = payload.data?.envelopeSummary?.status?.toLowerCase();

  if (!envelopeId || !status) {
    // ACK anyway so DocuSign stops retrying unrecognised events.
    return NextResponse.json({ ok: true, ignored: true });
  }

  const adminClient = getSupabaseServerAdminClient();

  // Look up the transaction via the envelope id (unique).
  const { data: tx, error } = await adminClient
    .from('marketplace_transactions')
    .select('id, contract_status, seller_signed, buyer_signed')
    .eq('signature_envelope_id', envelopeId)
    .maybeSingle();

  if (error || !tx) {
    return NextResponse.json({
      ok: true,
      ignored: true,
      reason: 'unknown envelope',
    });
  }

  try {
    switch (status) {
      case 'completed': {
        await onContractFullySigned({
          adminClient,
          transactionId: tx.id,
          envelopeId,
        });
        break;
      }
      case 'declined':
      case 'voided': {
        // 
        await adminClient
          .from('marketplace_transactions')
          .update({ contract_status: 'cancelled' })
          .eq('id', tx.id);
        break;
      }
      case 'sent':
      case 'delivered':
      case 'signed': {
        // Partial progress — update the signer flags from the recipient list.
        const signers = payload.data?.envelopeSummary?.recipients?.signers ?? [];
        const sellerCompleted = signers.find(
          (s) => s.recipientId === '1' && s.status?.toLowerCase() === 'completed',
        );
        const buyerCompleted = signers.find(
          (s) => s.recipientId === '2' && s.status?.toLowerCase() === 'completed',
        );
        const patch: Record<string, unknown> = {};
        if (sellerCompleted) {
          patch.seller_signed = true;
          patch.seller_signed_at = sellerCompleted.signedDateTime ?? new Date().toISOString();
        }
        if (buyerCompleted) {
          patch.buyer_signed = true;
          patch.buyer_signed_at = buyerCompleted.signedDateTime ?? new Date().toISOString();
        }
        if (Object.keys(patch).length > 0) {
          // Derive the contract_status if only one side has signed.
          if (patch.seller_signed && !tx.buyer_signed) {
            patch.contract_status = 'seller_signed';
          } else if (patch.buyer_signed && !tx.seller_signed) {
            patch.contract_status = 'buyer_signed';
          }
          // 
          await adminClient
            .from('marketplace_transactions')
            .update(patch)
            .eq('id', tx.id);
        }
        break;
      }
    }
  } catch (err) {
    // Log + ACK so DocuSign doesn't hammer us with retries for deterministic
    // failures (they will show up in the Connect failure queue for inspection).
    console.error('[docusign webhook] handler failed', {
      envelopeId,
      status,
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { ok: false, error: 'handler failed' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
