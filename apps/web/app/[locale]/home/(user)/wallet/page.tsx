import { getTranslations } from 'next-intl/server';

import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';

import { CommissionInfo } from './_components/commission-info';
import { StripeConnectSetup } from './_components/stripe-connect-setup';
import { TransactionHistory } from './_components/transaction-history';
import { WalletOverview } from './_components/wallet-overview';

export const generateMetadata = async () => {
  const t = await getTranslations('wallet');

  return { title: t('title') };
};

/**
 * Stripe-Connect powered marketplace wallet (NOT a blockchain wallet).
 *
 * NOTE: the route slug `/home/wallet` was historically associated with
 * an on-chain wallet brief, but the actual implementation has always
 * been a Stripe Connect dashboard for marketplace sellers (balance,
 * payouts, commission schedule, fiat transactions). The Phase 6 audit
 * mistakenly described this page as ethers.js / Polygon, but no such
 * code exists here. The blockchain UI lives at `/home/pricing` (see
 * Phase 6.3 commit message). Renaming the slug is out of scope for
 * Phase 6 because it would touch business logic.
 */
async function WalletPage() {
  const client = getSupabaseServerClient();
  const t = await getTranslations('wallet');
  const tCommon = await getTranslations('common');

  const user = await requireUser(client);
  const userId = user.data?.id;

  if (!userId) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = client as any;

  const [
    connectedAccountRes,
    walletRes,
    sellerTransactionsRes,
    buyerTransactionsRes,
  ] = await Promise.all([
    c
      .from('stripe_connected_accounts')
      .select('*')
      .eq('account_id', userId)
      .single(),
    c.from('wallet_balances').select('*').eq('account_id', userId).single(),
    c
      .from('marketplace_transactions')
      .select('*, listings(title)')
      .eq('seller_account_id', userId)
      .order('created_at', { ascending: false })
      .limit(20),
    c
      .from('marketplace_transactions')
      .select('*, listings(title)')
      .eq('buyer_account_id', userId)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const connectedAccount = connectedAccountRes.data;
  const wallet = walletRes.data;
  const sellerTransactions = sellerTransactionsRes.data ?? [];
  const buyerTransactions = buyerTransactionsRes.data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.marketplace')}
        title={t('title')}
        subtitle={t('transactionsSubtitle')}
      />

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
        sellerTransactions={sellerTransactions}
        buyerTransactions={buyerTransactions}
      />
    </div>
  );
}

export default WalletPage;
