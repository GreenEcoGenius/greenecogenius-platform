import { NextRequest, NextResponse } from 'next/server';

import * as z from 'zod';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { computeDataHash } from '~/lib/blockchain/alchemy-service';
import { getLotById } from '~/lib/mock/traceability-mock-data';
import { generateCertificatePDF } from '~/lib/services/pdf/templates/certificate-template';

const IssueSchema = z.object({
  lotIds: z.array(z.string()).min(1).max(50),
});

function generateCertNumber(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `CERT-2026-${num}`;
}

export async function POST(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = IssueSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { lotIds } = parsed.data;
  const issuedAt = new Date().toISOString();
  const blockchainConfigured = Boolean(
    process.env.CONTRACT_ADDRESS && process.env.DEPLOYER_PRIVATE_KEY,
  );

  const certificates: Array<{
    lotId: string;
    certNumber: string;
    hash: string;
    txHash: string | null;
    pdfBase64: string;
  }> = [];

  for (const lotId of lotIds) {
    const lot = getLotById(lotId);

    if (!lot) {
      continue;
    }

    const certNumber = generateCertNumber();

    const certData = {
      certNumber,
      lotId: lot.lotId,
      material: lot.materialType,
      weightKg: lot.weightKg,
      seller: lot.sellerName,
      buyer: lot.buyerName,
      origin: lot.originCity,
      destination: lot.destinationCity,
      co2Avoided: lot.co2AvoidedKg,
      issuedAt,
      platform: 'GreenEcoGenius',
    };

    const hash = computeDataHash(certData);

    let txHash: string | null = null;

    if (blockchainConfigured) {
      try {
        const { issueCertificateOnChain } =
          await import('~/lib/blockchain/alchemy-service');

        const result = await issueCertificateOnChain(lot.lotId, certData);
        txHash = result.txHash;
      } catch (err) {
        console.error(
          `Blockchain issuance failed for ${lotId}, continuing off-chain:`,
          err,
        );
      }
    }

    // Generate real PDF
    const pdfBuffer = await generateCertificatePDF({
      certNumber,
      lotId: lot.lotId,
      material: lot.materialType,
      qualityGrade: lot.qualityGrade,
      weightKg: lot.weightKg,
      seller: lot.sellerName,
      buyer: lot.buyerName,
      origin: lot.originCity,
      destination: lot.destinationCity,
      co2AvoidedKg: lot.co2AvoidedKg,
      hash,
      txHash,
      issuedAt,
      contractAddress: process.env.CONTRACT_ADDRESS ?? undefined,
    });

    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

    certificates.push({
      lotId: lot.lotId,
      certNumber,
      hash,
      txHash,
      pdfBase64,
    });
  }

  return NextResponse.json({ certificates });
}
