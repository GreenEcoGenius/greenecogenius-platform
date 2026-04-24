import { AuthLayoutShell } from '@kit/auth/shared';

import { AppLogo } from '~/components/app-logo';

function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <AuthLayoutShell
      Logo={AppLogo}
      className="bg-cloud-50"
      contentClassName="border-cloud-200"
    >
      {children}
    </AuthLayoutShell>
  );
}

export default AuthLayout;
