export interface AIResponse {
  agent: string;
  model: string;
  content: string;
  usage: { input_tokens: number; output_tokens: number };
  norms_referenced?: string[];
}

export interface AIContext {
  locale?: string;
  orgId?: string;
  orgData?: Record<string, unknown>;
  lotData?: Record<string, unknown>;
  carbonData?: Record<string, unknown>;
  previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface CarbonCalculationRequest {
  reportingYear: number;
  scope1?: {
    naturalGasKwh?: number;
    fuelLiters?: number;
    fuelType?: string;
  };
  scope2?: {
    electricityKwh?: number;
    source?: string;
    heatingKwh?: number;
  };
  scope3?: {
    businessTravelKm?: number;
    commutingEmployees?: number;
    purchasesEur?: number;
    wasteTonnes?: number;
  };
  platformData?: {
    co2Avoided?: number;
    tonnesRecycled?: number;
    transactionCount?: number;
  };
}

export interface ESGReportRequest {
  reportingYear: number;
  reportType: 'ghg_protocol' | 'csrd' | 'gri';
  includeBlockchainProofs?: boolean;
}
