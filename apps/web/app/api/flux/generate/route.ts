import crypto from 'crypto';

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { FluxClient } from '~/lib/services/flux-client';
import {
  canGenerateImage,
  recordGeneration,
} from '~/lib/services/flux-usage';

export const runtime = 'nodejs';
export const maxDuration = 120; // Flux polling can take up to ~60s

const GENERATED_IMAGES_BUCKET = 'generated-images';

export async function POST(request: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { prompt, width, height, context, context_id } = body as {
    prompt?: string;
    width?: number;
    height?: number;
    context?: string;
    context_id?: string;
  };

  if (!prompt || !context) {
    return NextResponse.json(
      { error: 'Missing required fields: prompt, context' },
      { status: 400 },
    );
  }

  // Plan gating
  const { allowed, remaining, plan } = await canGenerateImage(
    client,
    user.id,
  );

  if (!allowed) {
    const message =
      plan === 'essentiel'
        ? 'Image generation requires the Advanced plan or higher.'
        : 'Monthly image generation limit reached.';
    return NextResponse.json(
      { error: message, plan, remaining },
      { status: 403 },
    );
  }

  // Build cache key
  const promptHash = crypto
    .createHash('sha256')
    .update(prompt)
    .digest('hex')
    .slice(0, 16);
  const fileKey = context_id ?? promptHash;
  const fileName = `flux/${context}/${fileKey}.png`;

  // Use admin client for storage operations (no RLS on storage)
  const adminClient = getSupabaseServerAdminClient();

  // Check cache — see if the file already exists in Supabase Storage
  const { data: fileCheck } = await adminClient.storage
    .from(GENERATED_IMAGES_BUCKET)
    .list(`flux/${context}`, {
      search: `${fileKey}.png`,
    });

  if (fileCheck && fileCheck.length > 0) {
    const { data: publicUrl } = adminClient.storage
      .from(GENERATED_IMAGES_BUCKET)
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl.publicUrl, cached: true });
  }

  // Check Flux is configured
  if (!FluxClient.isConfigured()) {
    return NextResponse.json(
      { error: 'Flux API not configured' },
      { status: 503 },
    );
  }

  try {
    const flux = new FluxClient();
    const imageUrl = await flux.generateAndWait({
      prompt,
      width: width ?? 1024,
      height: height ?? 1024,
    });

    // Download generated image and store in Supabase
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    const { error: uploadError } = await adminClient.storage
      .from(GENERATED_IMAGES_BUCKET)
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Flux storage upload error:', uploadError);
      // Return the direct Flux URL as fallback
      return NextResponse.json({ url: imageUrl, cached: false });
    }

    const { data: publicUrl } = adminClient.storage
      .from(GENERATED_IMAGES_BUCKET)
      .getPublicUrl(fileName);

    // Record usage for plan limits (use RLS-enforced client)
    await recordGeneration(
      client,
      user.id,
      context,
      fileKey,
      fileName,
    );

    return NextResponse.json({
      url: publicUrl.publicUrl,
      cached: false,
    });
  } catch (error) {
    console.error('Flux generation error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Image generation failed',
      },
      { status: 500 },
    );
  }
}
