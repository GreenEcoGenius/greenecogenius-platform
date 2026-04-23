import Link from 'next/link';

import type { AuthError } from '@supabase/supabase-js';
import { AlertTriangle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { ResendAuthLinkForm } from '@kit/auth/resend-email-link';
import { Trans } from '@kit/ui/trans';

import { EnviroAuthHeading } from '~/components/enviro/auth';
import { EnviroButton } from '~/components/enviro/enviro-button';
import pathsConfig from '~/config/paths.config';

interface AuthCallbackErrorPageProps {
  searchParams: Promise<{
    error: string;
    callback?: string;
    email?: string;
    code?: AuthError['code'];
  }>;
}

async function AuthCallbackErrorPage(props: AuthCallbackErrorPageProps) {
  const { error, callback, code } = await props.searchParams;
  const signInPath = pathsConfig.auth.signIn;
  const redirectPath = callback ?? pathsConfig.auth.callback;
  const t = await getTranslations('auth');

  return (
    <>
      <EnviroAuthHeading
        tag={t('signIn')}
        title={t('callbackErrorTitle')}
        subtitle={t('callbackErrorSubtitle')}
      />

      <div
        role="alert"
        className="flex items-start gap-3 rounded-[--radius-enviro-md] border border-[--color-enviro-ember-200] bg-[--color-enviro-ember-50] px-4 py-3 text-sm text-[--color-enviro-ember-700]"
      >
        <AlertTriangle
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0"
          strokeWidth={1.5}
        />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-[--color-enviro-ember-700]">
            <Trans i18nKey="auth.authenticationErrorAlertHeading" />
          </p>
          <p className="text-[--color-enviro-forest-900]">
            <Trans i18nKey={error ?? 'auth.authenticationErrorAlertBody'} />
          </p>
        </div>
      </div>

      <AuthCallbackForm
        code={code}
        signInPath={signInPath}
        redirectPath={redirectPath}
      />
    </>
  );
}

function AuthCallbackForm(props: {
  signInPath: string;
  redirectPath?: string;
  code?: AuthError['code'];
}) {
  switch (props.code) {
    case 'otp_expired':
      return <ResendAuthLinkForm redirectPath={props.redirectPath} />;

    default:
      return <SignInButton signInPath={props.signInPath} />;
  }
}

function SignInButton(props: { signInPath: string }) {
  return (
    <EnviroButton
      variant="primary"
      size="md"
      magnetic
      className="w-full"
      render={
        <Link href={props.signInPath}>
          <Trans i18nKey="auth.signIn" />
        </Link>
      }
    />
  );
}

export default AuthCallbackErrorPage;
