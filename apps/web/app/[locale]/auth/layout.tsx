import { AuthLayoutShell } from '@kit/auth/shared';

import { AppLogo } from '~/components/app-logo';

function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <AuthLayoutShell
      Logo={AppLogo}
      className="bg-[#0A2F1F]"
      contentClassName="border-[#1A5C3E]"
    >
      {children}
    </AuthLayoutShell>
  );
}

export default AuthLayout;
