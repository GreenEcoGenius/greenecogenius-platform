import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Heading } from '@kit/ui/heading';
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { CommissionInfo } from './_components/commission-info';
import { StripeConnectSetup } from './_components/stripe-connect-setup';
import { TransactionHistory } from './_components/transaction-history';
import { WalletOverview } from './_components/wallet-overview';

export const generateMetadata = async () => {
  const t = await getTranslations('wallet');

  return { title: t('title') };
};

async function WalletPage() {
  const client = getSupabaseServerClient();
  const user = await requireUser(client);
  const userId = user.data?.id;

  if (!userId) {
    return null;
  }

  // Fetch connected account status
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: connectedAccount } = await (client as any)
    .from('stripe_connected_accounts')
    .select('*')
    .eq('account_id', userId)
    .single();

  // Fetch wallet balance
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: wallet } = await (client as any)
    .from('wallet_balances')
    .select('*')
    .eq('account_id', userId)
    .single();

  // Fetch recent transactions (as seller)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sellerTransactions } = await (client as any)
    .from('marketplace_transactions')
    .select('*, listings(title)')
    .eq('seller_account_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  // Fetch recent transactions (as buyer)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: buyerTransactions } = await (client as any)
    .from('marketplace_transactions')
    .select('*, listings(title)')
    .eq('buyer_account_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <PageBody>
      <PageHeader description="">
        <Heading level={3}>
          <Trans i18nKey="wallet.title" />
        </Heading>
      </PageHeader>

      <div className="space-y-8">
        <StripeConnectSetup
          connectedAccount={
            connectedAccount
              ? {
                  stripeAccountId: connectedAccount.stripe_account_id,
                  onboardingComplete:
                    connectedAccount.onboarding_complete ?? false,
                  chargesEnabled: connectedAccount.charges_enabled ?? false,
                  payoutsEnabled: connectedAccount.payouts_enabled ?? false,
                }
              : null
          }
        />

        <WalletOverview
          wallet={
            wallet
              ? {
                  availableBalance: wallet.available_balance,
                  pendingBalance: wallet.pending_balance,
                  totalEarned: wallet.total_earned,
                  totalFeesPaid: wallet.total_fees_paid,
                }
              : null
          }
        />

        <CommissionInfo />

        <TransactionHistory
          sellerTransactions={sellerTransactions ?? []}
          buyerTransactions={buyerTransactions ?? []}
        />
      </div>
    </PageBody>
  );
}

export default WalletPage;
