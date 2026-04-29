import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PageBody } from '@kit/ui/page';

import { CommissionInfo } from './_components/commission-info';
import { DocuSignContracts } from './_components/docusign-contracts';
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
  const { data: connectedAccount } = await client
    .from('stripe_connected_accounts')
    .select('*')
    .eq('account_id', userId)
    .single();

  // Fetch wallet balance
  const { data: wallet } = await client
    .from('wallet_balances')
    .select('*')
    .eq('account_id', userId)
    .single();

  // Fetch recent transactions (as seller)
  const { data: sellerTransactions } = await client
    .from('marketplace_transactions')
    .select('*, listings(title)')
    .eq('seller_account_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  // Fetch recent transactions (as buyer)
  const { data: buyerTransactions } = await client
    .from('marketplace_transactions')
    .select('*, listings(title)')
    .eq('buyer_account_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  // Combine all transactions for DocuSign contracts section
  const allTransactions = [
    ...(sellerTransactions ?? []),
    ...(buyerTransactions ?? []),
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <PageBody>
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

        <DocuSignContracts transactions={allTransactions} />

        <TransactionHistory
          sellerTransactions={sellerTransactions ?? []}
          buyerTransactions={buyerTransactions ?? []}
        />
      </div>
    </PageBody>
  );
}

export default WalletPage;
