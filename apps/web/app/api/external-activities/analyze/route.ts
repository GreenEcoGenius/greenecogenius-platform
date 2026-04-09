import { NextRequest, NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { MODELS, getAnthropicClient } from '~/lib/ai/client';
import { DOCUMENTS_BUCKET } from '~/lib/services/external-activities-service';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface AnalysisResult {
  title: string | null;
  description: string | null;
  quantitative_value: number | null;
  quantitative_unit: string | null;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Genius AI non configure' },
      { status: 503 },
    );
  }

  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    path?: string;
    category?: string;
  } | null;

  if (!body?.path || typeof body.path !== 'string') {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 });
  }

  // RLS enforces that only files under <user.id>/ are readable — but we
  // also belt-and-braces check the prefix here.
  if (!body.path.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Download the file from the private bucket via the RLS-scoped client.
  const { data: blob, error: downloadError } = await client.storage
    .from(DOCUMENTS_BUCKET)
    .download(body.path);

  if (downloadError || !blob) {
    return NextResponse.json(
      { error: 'Fichier introuvable' },
      { status: 404 },
    );
  }

  if (blob.type !== 'application/pdf') {
    return NextResponse.json(
      { error: 'Seuls les PDF peuvent etre analyses par Genius pour le moment.' },
      { status: 415 },
    );
  }

  const arrayBuffer = await blob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');

  const anthropic = getAnthropicClient();

  const systemPrompt = `Tu es Genius, l'assistant IA de la plateforme GreenEcoGenius. Tu analyses des documents ESG/RSE (politiques, rapports, attestations, bilans) pour extraire des informations structurees.

La categorie du document est : ${body.category ?? 'inconnue'}.

Ta reponse DOIT etre un objet JSON strict avec EXACTEMENT ces cles :
{
  "title": string | null,                 // Titre court et explicite (< 100 caracteres)
  "description": string | null,           // Resume en 1-3 phrases de ce que contient le document
  "quantitative_value": number | null,    // Une valeur chiffree clef si presente (ex: 42, 1250, 0.15)
  "quantitative_unit": string | null      // Unite associee (ex: "%", "t CO2e", "ETP", "EUR", "h")
}

Regles :
- Si un champ n'est pas extractible avec confiance, mets null.
- Pas de commentaire, pas de markdown, pas de prose autour du JSON.
- La description doit etre en francais, sans emoji.
- Ne jamais inventer une valeur chiffree si elle n'est pas explicitement dans le document.`;

  let rawResponse: string;
  try {
    const message = await anthropic.messages.create({
      model: MODELS.BALANCED,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: base64,
              },
            },
            {
              type: 'text',
              text: 'Analyse ce document et renvoie le JSON structure demande.',
            },
          ],
        },
      ],
    });

    const firstBlock = message.content.find((c) => c.type === 'text');
    rawResponse = firstBlock && 'text' in firstBlock ? firstBlock.text : '';
  } catch (e) {
    const reason = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json(
      { error: `Analyse echouee: ${reason}` },
      { status: 502 },
    );
  }

  // Parse — strip any stray ```json fences.
  let parsed: AnalysisResult | null = null;
  try {
    const cleaned = rawResponse
      .trim()
      .replace(/^```(?:json)?/i, '')
      .replace(/```$/, '')
      .trim();
    parsed = JSON.parse(cleaned) as AnalysisResult;
  } catch {
    return NextResponse.json(
      { error: "Genius n'a pas pu structurer l'analyse." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    title: parsed.title ?? null,
    description: parsed.description ?? null,
    quantitative_value:
      typeof parsed.quantitative_value === 'number' &&
      Number.isFinite(parsed.quantitative_value)
        ? parsed.quantitative_value
        : null,
    quantitative_unit: parsed.quantitative_unit ?? null,
  });
}
