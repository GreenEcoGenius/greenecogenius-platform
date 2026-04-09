import 'server-only';

export interface FluxGenerateParams {
  prompt: string;
  width?: number;
  height?: number;
  steps?: number;
  guidance?: number;
  seed?: number;
  safety_tolerance?: number;
}

interface FluxTaskResponse {
  id: string;
}

interface FluxResult {
  id: string;
  status: 'Ready' | 'Pending' | 'Error';
  result?: {
    sample: string;
  };
}

export class FluxClient {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    const apiKey = process.env.FLUX_API_KEY;
    if (!apiKey) {
      throw new Error('FLUX_API_KEY is not configured');
    }
    this.apiKey = apiKey;
    this.baseUrl = process.env.FLUX_API_URL ?? 'https://api.bfl.ml';
    this.model = process.env.FLUX_MODEL ?? 'flux-pro-1.1';
  }

  static isConfigured(): boolean {
    return !!process.env.FLUX_API_KEY;
  }

  async generate(params: FluxGenerateParams): Promise<string> {
    const response = await fetch(`${this.baseUrl}/v1/${this.model}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Key': this.apiKey,
      },
      body: JSON.stringify({
        prompt: params.prompt,
        width: params.width ?? 1024,
        height: params.height ?? 1024,
        steps: params.steps ?? 28,
        guidance: params.guidance ?? 3.5,
        seed: params.seed,
        safety_tolerance: params.safety_tolerance ?? 2,
        output_format: 'png',
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `Flux API error: ${response.status} ${response.statusText} ${text}`,
      );
    }

    const data: FluxTaskResponse = await response.json();
    return data.id;
  }

  async getResult(taskId: string, maxRetries = 60): Promise<string> {
    for (let i = 0; i < maxRetries; i++) {
      const response = await fetch(
        `${this.baseUrl}/v1/get_result?id=${taskId}`,
        { headers: { 'X-Key': this.apiKey } },
      );

      const data: FluxResult = await response.json();

      if (data.status === 'Ready' && data.result?.sample) {
        return data.result.sample;
      }

      if (data.status === 'Error') {
        throw new Error(`Flux generation failed for task ${taskId}`);
      }

      await new Promise((r) => setTimeout(r, 1000));
    }

    throw new Error(`Flux generation timeout for task ${taskId}`);
  }

  async generateAndWait(params: FluxGenerateParams): Promise<string> {
    const taskId = await this.generate(params);
    return this.getResult(taskId);
  }
}
