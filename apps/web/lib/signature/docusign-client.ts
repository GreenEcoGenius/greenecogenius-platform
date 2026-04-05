import 'server-only';

import docusign from 'docusign-esign';

/**
 * Thin, typed wrapper around docusign-esign.
 *
 * The SDK ships no TypeScript types, so we keep the `any` surface confined
 * to this file and expose a small, strict API to the rest of the codebase:
 *
 *   - createEnvelopeForContract(...)  create + send a 2-signer envelope
 *   - getEnvelopeStatus(envelopeId)   poll (we mainly rely on webhooks)
 *   - downloadSignedDocument(envelopeId)  fetch the fully-signed PDF
 *
 * Auth uses the JWT grant (service-to-service). A one-time browser consent
 * is required per user id — see README/commit note for the consent URL.
 */

export interface DocuSignSigner {
  email: string;
  name: string;
  /** Position on the signature page — matches the page laid out by
   * ContractService.signatureBox (signatures live on page 3). */
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
  /** Webhook url — DocuSign will POST signature events here */
  webhookUrl?: string;
}

export interface CreateEnvelopeResult {
  envelopeId: string;
  status: string;
}

const REQUIRED_ENV = [
  'DOCUSIGN_INTEGRATION_KEY',
  'DOCUSIGN_USER_ID',
  'DOCUSIGN_ACCOUNT_ID',
  'DOCUSIGN_RSA_PRIVATE_KEY',
] as const;

const DEFAULT_BASE_PATH = 'https://demo.docusign.net/restapi';
const DEFAULT_OAUTH_HOST = 'account-d.docusign.com';

function ensureConfigured(): void {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new DocuSignNotConfiguredError(
      `DocuSign n'est pas configure. Variables manquantes: ${missing.join(', ')}`,
    );
  }
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

function buildConsentUrl(): string {
  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY ?? '';
  const redirect =
    process.env.DOCUSIGN_CONSENT_REDIRECT_URI ??
    'https://www.docusign.com';
  const host =
    process.env.DOCUSIGN_OAUTH_HOST ?? DEFAULT_OAUTH_HOST;
  const params = new URLSearchParams({
    response_type: 'code',
    scope: 'signature impersonation',
    client_id: integrationKey,
    redirect_uri: redirect,
  });
  return `https://${host}/oauth/auth?${params.toString()}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isConsentRequired(err: any): boolean {
  const body = err?.response?.body ?? err?.body ?? null;
  const error =
    typeof body === 'string'
      ? body
      : (body?.error as string | undefined);
  return error === 'consent_required';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getAuthenticatedClient(): Promise<any> {
  ensureConfigured();

  const basePath = process.env.DOCUSIGN_BASE_URL ?? DEFAULT_BASE_PATH;
  const oauthHost = process.env.DOCUSIGN_OAUTH_HOST ?? DEFAULT_OAUTH_HOST;

  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(basePath);
  apiClient.setOAuthBasePath(oauthHost);

  try {
    const results = await apiClient.requestJWTUserToken(
      process.env.DOCUSIGN_INTEGRATION_KEY,
      process.env.DOCUSIGN_USER_ID,
      ['signature', 'impersonation'],
      Buffer.from(process.env.DOCUSIGN_RSA_PRIVATE_KEY!, 'utf-8'),
      3600,
    );

    const accessToken = results?.body?.access_token;
    if (!accessToken) {
      throw new Error('Aucun access_token renvoye par DocuSign');
    }

    apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);
    return apiClient;
  } catch (err) {
    if (isConsentRequired(err)) {
      throw new DocuSignConsentRequiredError(buildConsentUrl());
    }
    throw err;
  }
}

function buildSigner(
  signer: DocuSignSigner,
  recipientId: string,
): unknown {
  const s = new docusign.Signer();
  s.email = signer.email;
  s.name = signer.name;
  s.recipientId = recipientId;
  s.routingOrder = '1'; // parallel — both parties can sign independently

  const tab = new docusign.SignHere();
  tab.documentId = '1';
  tab.pageNumber = '3';
  tab.xPosition = String(signer.anchorX);
  tab.yPosition = String(signer.anchorY);

  const dateTab = new docusign.DateSigned();
  dateTab.documentId = '1';
  dateTab.pageNumber = '3';
  dateTab.xPosition = String(signer.anchorX);
  dateTab.yPosition = String(signer.anchorY + 40);

  s.tabs = { signHereTabs: [tab], dateSignedTabs: [dateTab] };
  return s;
}

export class DocuSignClient {
  static isConfigured(): boolean {
    return REQUIRED_ENV.every((k) => Boolean(process.env[k]));
  }

  static async createEnvelopeForContract(
    input: CreateEnvelopeInput,
  ): Promise<CreateEnvelopeResult> {
    const apiClient = await getAuthenticatedClient();
    const envelopesApi = new docusign.EnvelopesApi(apiClient);
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID!;

    const doc = new docusign.Document();
    doc.documentBase64 = input.pdfBuffer.toString('base64');
    doc.name = `Contrat ${input.contractId}`;
    doc.fileExtension = 'pdf';
    doc.documentId = '1';

    const sellerSigner = buildSigner(input.seller, '1');
    const buyerSigner = buildSigner(input.buyer, '2');

    const envelope = new docusign.EnvelopeDefinition();
    envelope.emailSubject = input.emailSubject;
    envelope.emailBlurb = input.emailBlurb;
    envelope.documents = [doc];
    envelope.recipients = { signers: [sellerSigner, buyerSigner] };
    envelope.status = 'sent';
    envelope.externalEnvelopeId = input.contractId;

    if (input.webhookUrl) {
      const eventNotification = new docusign.EventNotification();
      eventNotification.url = input.webhookUrl;
      eventNotification.loggingEnabled = 'true';
      eventNotification.requireAcknowledgment = 'true';
      eventNotification.includeDocuments = 'false';
      eventNotification.includeCertificateOfCompletion = 'true';
      eventNotification.envelopeEvents = [
        { envelopeEventStatusCode: 'completed' },
        { envelopeEventStatusCode: 'declined' },
        { envelopeEventStatusCode: 'voided' },
        { envelopeEventStatusCode: 'delivered' },
      ];
      eventNotification.recipientEvents = [
        { recipientEventStatusCode: 'Completed' },
        { recipientEventStatusCode: 'Declined' },
      ];
      envelope.eventNotifications = [eventNotification];
    }

    const results = await envelopesApi.createEnvelope(accountId, {
      envelopeDefinition: envelope,
    });

    return {
      envelopeId: results.envelopeId,
      status: results.status,
    };
  }

  static async getEnvelopeStatus(envelopeId: string): Promise<string> {
    const apiClient = await getAuthenticatedClient();
    const envelopesApi = new docusign.EnvelopesApi(apiClient);
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID!;
    const envelope = await envelopesApi.getEnvelope(accountId, envelopeId);
    return envelope.status;
  }

  /** Download the combined (merged) signed PDF for an envelope. */
  static async downloadSignedDocument(envelopeId: string): Promise<Buffer> {
    const apiClient = await getAuthenticatedClient();
    const envelopesApi = new docusign.EnvelopesApi(apiClient);
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID!;

    // 'combined' merges all documents + cert of completion into a single PDF
    const file = await envelopesApi.getDocument(
      accountId,
      envelopeId,
      'combined',
    );

    // The SDK returns a binary string for document downloads.
    if (Buffer.isBuffer(file)) return file;
    if (typeof file === 'string') return Buffer.from(file, 'binary');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Buffer.from((file as any) ?? '');
  }
}
