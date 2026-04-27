import { supabase } from '~/lib/supabase-client';
import type { Database } from '@kit/supabase/database';

export type TraceabilityCertificate =
  Database['public']['Tables']['traceability_certificates']['Row'];
export type BlockchainRecord =
  Database['public']['Tables']['blockchain_records']['Row'];

export interface CertificateWithBlockchain extends TraceabilityCertificate {
  blockchain_records: BlockchainRecord | null;
}

/**
 * Fetch all traceability certificates issued to an account.
 */
export async function fetchCertificates(
  accountId: string,
  limit = 30,
): Promise<CertificateWithBlockchain[]> {
  const { data, error } = await supabase
    .from('traceability_certificates')
    .select(
      `
      *,
      blockchain_records ( * )
    `,
    )
    .eq('issued_to_account_id', accountId)
    .order('issued_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []) as unknown as CertificateWithBlockchain[];
}

/**
 * Fetch a certificate by ID or by certificate_number (from QR scan).
 */
export async function fetchCertificateByIdOrNumber(
  idOrNumber: string,
): Promise<CertificateWithBlockchain | null> {
  // Try id first (UUID format)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrNumber);
  const column = isUuid ? 'id' : 'certificate_number';

  const { data, error } = await supabase
    .from('traceability_certificates')
    .select(
      `
      *,
      blockchain_records ( * )
    `,
    )
    .eq(column, idOrNumber)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return (data as unknown as CertificateWithBlockchain) ?? null;
}

/**
 * Build the PolygonScan URL for a transaction hash.
 * GreenEcoGenius blockchain records use Polygon mainnet.
 */
export function getPolygonScanUrl(hash: string | null): string | null {
  if (!hash) return null;
  // Use polygonscan for tx, or could be a block ref depending on hash format
  return `https://polygonscan.com/tx/${hash}`;
}

/**
 * Parse the geolocation_trail jsonb into a typed array.
 */
export interface GeolocationStep {
  step?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  timestamp?: string;
  actor?: string;
}

export function parseGeolocationTrail(
  trail: BlockchainRecord['geolocation_trail'] | null | undefined,
): GeolocationStep[] {
  if (!trail || !Array.isArray(trail)) return [];
  return trail as GeolocationStep[];
}
