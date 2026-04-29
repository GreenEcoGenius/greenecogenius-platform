import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { SiteFooter } from '~/(marketing)/_components/site-footer';
import { SiteHeader } from '~/(marketing)/_components/site-header';

async function SiteLayout(props: React.PropsWithChildren) {
  const client = getSupabaseServerClient();
  const user = await requireUser(client, { verifyMfa: false });

  return (
    <div className={'flex min-h-[100vh] flex-col overflow-x-hidden bg-[#0A2F1F] text-[#F5F5F0]'}>
      <SiteHeader user={user.data} />

      <div className="pt-14 md:pt-20">{props.children}</div>

      <SiteFooter />
    </div>
  );
}

export default SiteLayout;
