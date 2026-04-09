import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { createAuthCallbackService } from '@kit/supabase/auth';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import pathsConfig from '~/config/paths.config';

const LOCALE_COOKIE = 'NEXT_LOCALE';

export async function GET(request: NextRequest) {
  const service = createAuthCallbackService(getSupabaseServerClient());

  const { nextPath } = await service.exchangeCodeForSession(request, {
    joinTeamPath: pathsConfig.app.joinTeam,
    redirectPath: pathsConfig.app.home,
  });

  const locale = request.cookies.get(LOCALE_COOKIE)?.value ?? 'en';

  const localeAwarePath = nextPath.startsWith(`/${locale}`)
    ? nextPath
    : `/${locale}${nextPath}`;

  const url = new URL(localeAwarePath, request.url);

  return NextResponse.redirect(url);
}
