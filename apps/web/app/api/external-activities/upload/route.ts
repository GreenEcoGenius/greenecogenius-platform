import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import {
  ALLOWED_DOCUMENT_MIME_TYPES,
  DOCUMENTS_BUCKET,
  ExternalActivitiesService,
  MAX_DOCUMENT_SIZE_BYTES,
} from '~/lib/services/external-activities-service';

export const runtime = 'nodejs';

function sanitizeFilename(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 120);
}

export async function POST(req: NextRequest) {
  const client = getSupabaseServerClient();
  const { data: user, error: authError } = await requireUser(client);

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: 'Invalid multipart request' },
      { status: 400 },
    );
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: 'Empty file' }, { status: 400 });
  }

  if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
    return NextResponse.json(
      { error: `Fichier trop volumineux (max 10 MB)` },
      { status: 413 },
    );
  }

  if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(file.type as never)) {
    return NextResponse.json(
      { error: `Format non supporte. Formats acceptes : PDF, JPG, PNG, DOCX.` },
      { status: 415 },
    );
  }

  const safeName = sanitizeFilename(file.name || 'document');
  const uniquePrefix = crypto.randomUUID();
  const path = `${user.id}/${uniquePrefix}-${safeName}`;

  const { error: uploadError } = await client.storage
    .from(DOCUMENTS_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message ?? 'Upload failed' },
      { status: 500 },
    );
  }

  const signedUrl = await ExternalActivitiesService.getSignedDocumentUrl(
    client,
    path,
  );

  return NextResponse.json({
    path,
    signedUrl,
    filename: safeName,
    contentType: file.type,
    size: file.size,
  });
}
