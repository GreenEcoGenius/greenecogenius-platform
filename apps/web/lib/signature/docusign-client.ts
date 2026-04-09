import 'server-only';

import { createSign } from 'crypto';

/**
 * DocuSign REST client — zero-dependency.
 *
 * The `docusign-esign` SDK bundles a Node-only HTTP stack (superagent, jsonfile,
 * form-data, …) that Next.js/webpack cannot bundle, so we talk to DocuSign over
 * plain fetch using the documented REST API. The only Node primitive we rely on
 * is `crypto.createSign('RSA-SHA256')` to produce the JWT assertion for the JWT
 * grant flow — no external signing library needed.
 *
 * Auth: JWT grant (service-to-service). A one-time browser consent is required
 * per DOCUSIGN_USER_ID — see the consent URL exposed by DocuSignConsentRequiredError.
 *
 * Base URLs (sandbox by default):
 *   - REST:  https://demo.docusign.net/restapi/v2.1/accounts/{accountId}/...
 *   - OAuth: https://account-d.docusign.com/oauth/token
 *
 * For production, set DOCUSIGN_BASE_URL=https://www.docusign.net/restapi and
 * DOCUSIGN_OAUTH_HOST=account.docusign.com.
 */

// ── Public types ───────────────────────────────────────────────────────

export interface DocuSignSigner {
  email: string;
  name: string;
  /** Position of the SignHere tab on page 3 of the contract */
  anchorX: number;
  anchorY: number;
}

export interface CreateEnvelopeInput {
  contractId: string;
  emailSubject: string;
  emailBlurb: string;
  pdfBuffer: Buffer;
  seller: DocuSignSigner;
  buyer: DocuSignSigner;
  webhookUrl?: string;
}

export interface CreateEnvelopeResult {
  envelopeId: string;
  status: string;
}

export class DocuSignNotConfiguredError extends Error {
  readonly code = 'DOCUSIGN_NOT_CONFIGURED';
  constructor(message: string) {
    super(message);
    this.name = 'DocuSignNotConfiguredError';
  }
}

export class DocuSignConsentRequiredError extends Error {
  readonly code = 'DOCUSIGN_CONSENT_REQUIRED';
  readonly consentUrl: string;
  constructor(consentUrl: string) {
    super(
      `Consentement DocuSign requis. Visitez ${consentUrl} et cliquez "Allow" une seule fois.`,
    );
    this.name = 'DocuSignConsentRequiredError';
    this.consentUrl = consentUrl;
  }
}

// ── Configuration ──────────────────────────────────────────────────────

const REQUIRED_ENV = [
  'DOCUSIGN_INTEGRATION_KEY',
  'DOCUSIGN_USER_ID',
  'DOCUSIGN_ACCOUNT_ID',
  'DOCUSIGN_RSA_PRIVATE_KEY',
] as const;

const DEFAULT_REST_BASE = 'https://demo.docusign.net/restapi';
const DEFAULT_OAUTH_HOST = 'account-d.docusign.com';

function ensureConfigured(): void {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new DocuSignNotConfiguredError(
      `DocuSign n'est pas configure. Variables manquantes: ${missing.join(', ')}`,
    );
  }
}

function getRestBase(): string {
  return (process.env.DOCUSIGN_BASE_URL ?? DEFAULT_REST_BASE).replace(
    /\/$/,
    '',
  );
}

function getOauthHost(): string {
  return process.env.DOCUSIGN_OAUTH_HOST ?? DEFAULT_OAUTH_HOST;
}

function getAccountId(): string {
  return process.env.DOCUSIGN_ACCOUNT_ID!;
}

function buildConsentUrl(): string {
  const params = new URLSearchParams({
    response_type: 'code',
    scope: 'signature impersonation',
    client_id: process.env.DOCUSIGN_INTEGRATION_KEY ?? '',
    redirect_uri:
      process.env.DOCUSIGN_CONSENT_REDIRECT_URI ?? 'https://www.docusign.com',
  });
  return `https://${getOauthHost()}/oauth/auth?${params.toString()}`;
}

// ── JWT assertion (RS256) ──────────────────────────────────────────────

/**
 * Base64URL encoding — the standard base64 alphabet with `+/=` stripped /
 * substituted so the value is URL-safe as required by RFC 7515.
 */
function base64Url(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function normalizeRsaKey(raw: string): string {
  // Vercel env vars often collapse the PEM newlines into literal "\n". Restore
  // them so Node's crypto can parse the key.
  if (raw.includes('\\n')) return raw.replace(/\\n/g, '\n');
  return raw;
}

function buildJwtAssertion(): string {
  const header = { typ: 'JWT', alg: 'RS256' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: process.env.DOCUSIGN_INTEGRATION_KEY,
    sub: process.env.DOCUSIGN_USER_ID,
    iat: now,
    exp: now + 3600, // 1 hour — DocuSign max
    aud: getOauthHost(),
    scope: 'signature impersonation',
  };

  const signingInput = `${base64Url(JSON.stringify(header))}.${base64Url(
    JSON.stringify(payload),
  )}`;

  const privateKey = normalizeRsaKey(process.env.DOCUSIGN_RSA_PRIVATE_KEY!);
  const signer = createSign('RSA-SHA256');
  signer.update(signingInput);
  signer.end();
  const signature = base64Url(signer.sign(privateKey));

  return `${signingInput}.${signature}`;
}

// ── OAuth token ────────────────────────────────────────────────────────

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface CachedToken {
  token: string;
  expiresAt: number; // ms epoch
}

let cachedToken: CachedToken | null = null;

async function getAccessToken(): Promise<string> {
  ensureConfigured();

  // Reuse cached token if still valid for at least 2 more minutes.
  if (cachedToken && cachedToken.expiresAt - Date.now() > 2 * 60 * 1000) {
    return cachedToken.token;
  }

  const assertion = buildJwtAssertion();

  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });

  const res = await fetch(`https://${getOauthHost()}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let parsed: { error?: string; error_description?: string } | null = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      /* ignore */
    }
    if (parsed?.error === 'consent_required') {
      throw new DocuSignConsentRequiredError(buildConsentUrl());
    }
    throw new Error(
      `DocuSign JWT token request failed (${res.status}): ${
        parsed?.error_description ?? text ?? res.statusText
      }`,
    );
  }

  const data = (await res.json()) as TokenResponse;
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

// ── REST helpers ───────────────────────────────────────────────────────

async function docusignFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = await getAccessToken();
  const url = `${getRestBase()}${path}`;

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');

  return fetch(url, { ...init, headers });
}

// ── Envelope payload builders ──────────────────────────────────────────

interface SignHereTab {
  documentId: string;
  pageNumber: string;
  xPosition: string;
  yPosition: string;
}

interface DateSignedTab extends SignHereTab {}

interface EnvelopeSigner {
  email: string;
  name: string;
  recipientId: string;
  routingOrder: string;
  tabs: {
    signHereTabs: SignHereTab[];
    dateSignedTabs: DateSignedTab[];
  };
}

function buildSigner(
  signer: DocuSignSigner,
  recipientId: string,
): EnvelopeSigner {
  return {
    email: signer.email,
    name: signer.name,
    recipientId,
    routingOrder: '1', // parallel — both parties can sign independently
    tabs: {
      signHereTabs: [
        {
          documentId: '1',
          pageNumber: '3',
          xPosition: String(signer.anchorX),
          yPosition: String(signer.anchorY),
        },
      ],
      dateSignedTabs: [
        {
          documentId: '1',
          pageNumber: '3',
          xPosition: String(signer.anchorX),
          yPosition: String(signer.anchorY + 40),
        },
      ],
    },
  };
}

// ── Public API ─────────────────────────────────────────────────────────

export class DocuSignClient {
  static isConfigured(): boolean {
    return REQUIRED_ENV.every((k) => Boolean(process.env[k]));
  }

  static async createEnvelopeForContract(
    input: CreateEnvelopeInput,
  ): Promise<CreateEnvelopeResult> {
    ensureConfigured();
    const accountId = getAccountId();

    const envelopeDefinition = {
      emailSubject: input.emailSubject,
      emailBlurb: input.emailBlurb,
      status: 'sent',
      externalEnvelopeId: input.contractId,
      documents: [
        {
          documentBase64: input.pdfBuffer.toString('base64'),
          name: `Contrat ${input.contractId}`,
          fileExtension: 'pdf',
          documentId: '1',
        },
      ],
      recipients: {
        signers: [buildSigner(input.seller, '1'), buildSigner(input.buyer, '2')],
      },
      ...(input.webhookUrl
        ? {
            eventNotifications: [
              {
                url: input.webhookUrl,
                loggingEnabled: 'true',
                requireAcknowledgment: 'true',
                includeDocuments: 'false',
                includeCertificateOfCompletion: 'true',
                envelopeEvents: [
                  { envelopeEventStatusCode: 'completed' },
                  { envelopeEventStatusCode: 'declined' },
                  { envelopeEventStatusCode: 'voided' },
                  { envelopeEventStatusCode: 'delivered' },
                ],
                recipientEvents: [
                  { recipientEventStatusCode: 'Completed' },
                  { recipientEventStatusCode: 'Declined' },
                ],
              },
            ],
          }
        : {}),
    };

    const res = await docusignFetch(
      `/v2.1/accounts/${accountId}/envelopes`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(envelopeDefinition),
      },
    );

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(
        `DocuSign createEnvelope failed (${res.status}): ${text || res.statusText}`,
      );
    }

    const data = (await res.json()) as {
      envelopeId: string;
      status: string;
    };
    return { envelopeId: data.envelopeId, status: data.status };
  }

  static async getEnvelopeStatus(envelopeId: string): Promise<string> {
    ensureConfigured();
    const accountId = getAccountId();

    const res = await docusignFetch(
      `/v2.1/accounts/${accountId}/envelopes/${envelopeId}`,
    );
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(
        `DocuSign getEnvelope failed (${res.status}): ${text || res.statusText}`,
      );
    }
    const data = (await res.json()) as { status: string };
    return data.status;
  }

  /**
   * Download the merged "combined" PDF for an envelope — the fully-signed
   * contract plus the certificate of completion, stitched into a single PDF.
   */
  static async downloadSignedDocument(envelopeId: string): Promise<Buffer> {
    ensureConfigured();
    const accountId = getAccountId();

    const res = await docusignFetch(
      `/v2.1/accounts/${accountId}/envelopes/${envelopeId}/documents/combined`,
      {
        headers: { Accept: 'application/pdf' },
      },
    );

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(
        `DocuSign downloadSignedDocument failed (${res.status}): ${
          text || res.statusText
        }`,
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
