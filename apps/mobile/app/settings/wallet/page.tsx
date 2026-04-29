'use client';
import {
  useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Wallet,
  Clock,
  TrendingUp,
  Percent,
  ArrowDownToLine,
  ArrowUpRight,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  Package,
  RefreshCw,
  Globe,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Link2,
  FileSignature,
} from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { supabase } from '~/lib/supabase-client';

type TabType = 'sales' | 'purchases';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  commission: number;
  net: number;
  status: 'pending' | 'confirmed' | 'released' | 'cancelled';
  date: string;
  buyer?: string;
  seller?: string;
  blockchainHash?: string;
  type: 'sale' | 'purchase';
}

function WalletContent() {
  const t = useTranslations('wallet');
  const [activeTab, setActiveTab] = useState<TabType>('sales');
  const [stripeStatus, setStripeStatus] = useState<'not_connected' | 'pending' | 'verified'>('not_connected');
  const [loading, setLoading] = useState(true);

  // Wallet data (will be fetched from Supabase/Stripe in production)
  const [balanceAvailable, setBalanceAvailable] = useState(0);
  const [balancePending, setBalancePending] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalCommissions, setTotalCommissions] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const WALLET_URL = 'https://www.greenecogenius.tech/home/wallet';

  function handleConnectStripe() {
    window.open(WALLET_URL, '_blank');
  }

  function handleRefreshOnboarding() {
    window.open(WALLET_URL, '_blank');
  }

  function handleOpenDashboard() {
    window.open(WALLET_URL, '_blank');
  }

  useEffect(() => {
    async function loadWalletData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check Stripe Connect status from user metadata or accounts table
        const { data: memberships } = await supabase
          .from('accounts_memberships')
          .select('account_id')
          .eq('user_id', user.id)
          .limit(1);

        if (memberships && memberships.length > 0) {
          const accountId = memberships[0].account_id;

          // Check Stripe Connect status from stripe_connected_accounts table
          const { data: stripeAccount } = await supabase
            .from('stripe_connected_accounts')
            .select('stripe_account_id, onboarding_complete, charges_enabled, payouts_enabled')
            .eq('account_id', accountId)
            .single();

          if (stripeAccount) {
            if (stripeAccount.onboarding_complete && stripeAccount.charges_enabled) {
              setStripeStatus('verified');
            } else {
              setStripeStatus('pending');
            }
          } else {
            setStripeStatus('not_connected');
          }

          // Try to fetch wallet data from a wallet_balances view or table
          const { data: walletData } = await supabase
            .from('wallet_balances')
            .select('*')
            .eq('account_id', accountId)
            .single();

          if (walletData) {
            setBalanceAvailable(walletData.available ?? 0);
            setBalancePending(walletData.pending ?? 0);
            setTotalEarned(walletData.total_earned ?? 0);
            setTotalCommissions(walletData.total_commissions ?? 0);
          }

          // Fetch transactions
          const { data: txData } = await supabase
            .from('wallet_transactions')
            .select('*')
            .eq('account_id', accountId)
            .order('created_at', { ascending: false })
            .limit(50);

          if (txData) {
            setTransactions(txData.map((tx: any) => ({
              id: tx.id,
              title: tx.title ?? '',
              amount: tx.amount ?? 0,
              commission: tx.commission ?? 0,
              net: tx.net_amount ?? 0,
              status: tx.status ?? 'pending',
              date: tx.created_at ?? '',
              buyer: tx.buyer_name,
              seller: tx.seller_name,
              blockchainHash: tx.blockchain_hash,
              type: tx.transaction_type ?? 'sale',
            })));
          }
        }
      } catch (err) {
        console.error('Failed to load wallet data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadWalletData();
  }, []);

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }

  function getStatusConfig(status: string) {
    switch (status) {
      case 'pending':
        return { label: t('statusPending'), color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Clock };
      case 'confirmed':
        return { label: t('statusConfirmed'), color: 'text-blue-400', bg: 'bg-blue-400/10', icon: ShieldCheck };
      case 'released':
        return { label: t('statusReleased'), color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: CheckCircle2 };
      case 'cancelled':
        return { label: t('statusCancelled'), color: 'text-red-400', bg: 'bg-red-400/10', icon: AlertCircle };
      default:
        return { label: status, color: 'text-[#F5F5F0]/50', bg: 'bg-[#F5F5F0]/5', icon: Clock };
    }
  }

  function getCommissionRate(amount: number): number {
    if (amount <= 10000) return 0.08;
    if (amount <= 50000) return 0.05;
    return 0.03;
  }

  const filteredTransactions = transactions.filter(
    (tx) => (activeTab === 'sales' ? tx.type === 'sale' : tx.type === 'purchase')
  );

  if (loading) {
    return (
      <AppShell title={t('title')} showBack>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-[#F5F5F0]/30" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={t('title')} showBack>
      <div className="space-y-5 pb-6">

        {/* Stripe Connect Status Banner */}
        {stripeStatus === 'not_connected' && (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
                <CreditCard className="h-4.5 w-4.5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-amber-400">{t('stripeNotConnected')}</p>
                <p className="mt-0.5 text-[11px] text-[#F5F5F0]/40">{t('stripeNotConnectedDesc')}</p>
              </div>
            </div>
            <button
              onClick={handleConnectStripe}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-2.5 text-[13px] font-semibold text-[#0A2F1F] active:opacity-80 transition-opacity"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t('connectStripe')}
            </button>
          </div>
        )}

        {stripeStatus === 'pending' && (
          <div className="rounded-2xl border border-blue-400/20 bg-blue-400/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-400/10">
                <Clock className="h-4.5 w-4.5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-blue-400">{t('stripePending')}</p>
                <p className="mt-0.5 text-[11px] text-[#F5F5F0]/40">{t('stripePendingDesc')}</p>
              </div>
            </div>
            <button
              onClick={handleRefreshOnboarding}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-400/10 border border-blue-400/20 py-2.5 text-[13px] font-medium text-blue-400 active:opacity-80 transition-opacity"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t('completeVerification')}
            </button>
          </div>
        )}

        {stripeStatus === 'verified' && (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <p className="text-[12px] font-medium text-emerald-400">{t('stripeVerified')}</p>
              </div>
              <button
                onClick={handleOpenDashboard}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-400/10 px-3 py-1.5 text-[10px] font-medium text-emerald-400 active:opacity-80 transition-opacity"
              >
                <ExternalLink className="h-3 w-3" />
                {t('manageDashboard')}
              </button>
            </div>
          </div>
        )}

        {/* Balance Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Solde disponible */}
          <div className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
                {t('available')}
              </span>
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-400/10">
                <Wallet className="h-3 w-3 text-emerald-400" />
              </div>
            </div>
            <p className="text-[18px] font-bold text-[#F5F5F0]">{formatCurrency(balanceAvailable)}</p>
            <p className="mt-0.5 text-[9px] text-[#F5F5F0]/30">{t('availableDesc')}</p>
          </div>

          {/* En attente */}
          <div className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
                {t('pending')}
              </span>
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400/10">
                <Clock className="h-3 w-3 text-amber-400" />
              </div>
            </div>
            <p className="text-[18px] font-bold text-[#F5F5F0]">{formatCurrency(balancePending)}</p>
            <p className="mt-0.5 text-[9px] text-[#F5F5F0]/30">{t('pendingDesc')}</p>
          </div>

          {/* Total gagné */}
          <div className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
                {t('totalEarned')}
              </span>
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#B8D4E3]/10">
                <TrendingUp className="h-3 w-3 text-[#B8D4E3]" />
              </div>
            </div>
            <p className="text-[18px] font-bold text-[#F5F5F0]">{formatCurrency(totalEarned)}</p>
            <p className="mt-0.5 text-[9px] text-[#F5F5F0]/30">{t('totalEarnedDesc')}</p>
          </div>

          {/* Commissions */}
          <div className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#F5F5F0]/40">
                {t('commissions')}
              </span>
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-400/10">
                <ArrowDownToLine className="h-3 w-3 text-purple-400" />
              </div>
            </div>
            <p className="text-[18px] font-bold text-[#F5F5F0]">{formatCurrency(totalCommissions)}</p>
            <p className="mt-0.5 text-[9px] text-[#F5F5F0]/30">{t('commissionsDesc')}</p>
          </div>
        </div>

        {/* Withdraw Button */}
        {balanceAvailable > 0 && stripeStatus === 'verified' && (
          <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#B8D4E3] py-3.5 text-[14px] font-semibold text-[#0A2F1F] active:opacity-80 transition-opacity">
            <ArrowUpRight className="h-4 w-4" />
            {t('withdraw')}
          </button>
        )}

        {/* Commission Grid */}
        <div className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="h-4 w-4 text-[#B8D4E3]" />
            <h3 className="text-[13px] font-semibold text-[#F5F5F0]">{t('commissionGrid')}</h3>
          </div>
          <p className="text-[11px] text-[#F5F5F0]/40 mb-3">{t('commissionGridDesc')}</p>

          <div className="grid grid-cols-3 gap-2">
            {/* 8% */}
            <div className="rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.02] p-3 text-center">
              <div className="flex h-7 w-7 mx-auto items-center justify-center rounded-lg bg-[#B8D4E3]/10 mb-2">
                <RefreshCw className="h-3.5 w-3.5 text-[#B8D4E3]" />
              </div>
              <p className="text-[18px] font-bold text-[#F5F5F0]">8%</p>
              <p className="mt-0.5 text-[9px] text-[#F5F5F0]/40">{t('upTo10k')}</p>
            </div>
            {/* 5% */}
            <div className="rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.02] p-3 text-center">
              <div className="flex h-7 w-7 mx-auto items-center justify-center rounded-lg bg-emerald-400/10 mb-2">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <p className="text-[18px] font-bold text-[#F5F5F0]">5%</p>
              <p className="mt-0.5 text-[9px] text-[#F5F5F0]/40">{t('range10kTo50k')}</p>
            </div>
            {/* 3% */}
            <div className="rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.02] p-3 text-center">
              <div className="flex h-7 w-7 mx-auto items-center justify-center rounded-lg bg-purple-400/10 mb-2">
                <Globe className="h-3.5 w-3.5 text-purple-400" />
              </div>
              <p className="text-[18px] font-bold text-[#F5F5F0]">3%</p>
              <p className="mt-0.5 text-[9px] text-[#F5F5F0]/40">{t('above50k')}</p>
            </div>
          </div>

          {/* Launch offer */}
          <div className="mt-3 rounded-xl bg-emerald-400/5 border border-emerald-400/15 px-3.5 py-2.5">
            <p className="text-[11px] font-medium text-emerald-400 text-center">
              {t('launchOffer')}
            </p>
          </div>
        </div>

        {/* Blockchain Traceability Info */}
        <div className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="h-4 w-4 text-purple-400" />
            <h3 className="text-[13px] font-semibold text-[#F5F5F0]">{t('blockchainTitle')}</h3>
          </div>
          <p className="text-[11px] text-[#F5F5F0]/40 leading-relaxed">
            {t('blockchainDesc')}
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            <span className="text-[10px] text-purple-400 font-medium">Polygon (Alchemy API)</span>
          </div>
        </div>


        {/* Contracts DocuSign */}
        <div className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileSignature className="h-4 w-4 text-blue-400" />
            <h3 className="text-[13px] font-semibold text-[#F5F5F0]">{t('contractsTitle')}</h3>
          </div>
          <p className="text-[11px] text-[#F5F5F0]/40 leading-relaxed mb-3">
            {t('contractsDesc')}
          </p>
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 rounded-xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02]">
              <FileSignature className="h-6 w-6 text-[#F5F5F0]/15 mb-2" />
              <p className="text-[11px] text-[#F5F5F0]/30">{t('noContracts')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => {
                const contractStatus = (tx as any).contract_status || 'not_sent';
                const getContractStatusConfig = (status: string) => {
                  switch (status) {
                    case 'fully_signed':
                    case 'blockchain_certified':
                      return { label: t('contractSigned'), color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
                    case 'seller_signed':
                    case 'buyer_signed':
                      return { label: t('contractPartial'), color: 'text-amber-400', bg: 'bg-amber-400/10' };
                    case 'sent':
                      return { label: t('contractSent'), color: 'text-blue-400', bg: 'bg-blue-400/10' };
                    default:
                      return { label: t('contractPending'), color: 'text-[#F5F5F0]/40', bg: 'bg-[#F5F5F0]/5' };
                  }
                };
                const cStatus = getContractStatusConfig(contractStatus);
                return (
                  <div key={`contract-${tx.id}`} className="rounded-xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-medium text-[#F5F5F0]">{tx.title}</p>
                        <p className="text-[9px] text-[#F5F5F0]/40 mt-0.5">{tx.date}</p>
                      </div>
                      <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${cStatus.bg} ${cStatus.color}`}>
                        {cStatus.label}
                      </span>
                    </div>
                    {contractStatus !== 'fully_signed' && contractStatus !== 'blockchain_certified' && (
                      <button
                        onClick={() => window.open(`https://greenecogenius.tech/home/transactions/${tx.id}`, '_blank')}
                        className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-400/10 border border-blue-400/20 py-2 text-[11px] font-medium text-blue-400 active:opacity-80 transition-opacity"
                      >
                        <FileSignature className="h-3 w-3" />
                        {t('signContract')}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-semibold text-[#F5F5F0]">{t('transactionHistory')}</h3>
            <div className="flex rounded-lg overflow-hidden border border-[#F5F5F0]/[0.08]">
              <button
                onClick={() => setActiveTab('sales')}
                className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  activeTab === 'sales'
                    ? 'bg-[#B8D4E3] text-[#0A2F1F]'
                    : 'text-[#F5F5F0]/50'
                }`}
              >
                {t('sales')} ({transactions.filter(tx => tx.type === 'sale').length})
              </button>
              <button
                onClick={() => setActiveTab('purchases')}
                className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  activeTab === 'purchases'
                    ? 'bg-[#B8D4E3] text-[#0A2F1F]'
                    : 'text-[#F5F5F0]/50'
                }`}
              >
                {t('purchases')} ({transactions.filter(tx => tx.type === 'purchase').length})
              </button>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02]">
              <Package className="h-8 w-8 text-[#F5F5F0]/15 mb-2" />
              <p className="text-[12px] text-[#F5F5F0]/30">
                {activeTab === 'sales' ? t('noSales') : t('noPurchases')}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((tx) => {
                const statusConfig = getStatusConfig(tx.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <div
                    key={tx.id}
                    className="rounded-2xl border border-[#F5F5F0]/[0.06] bg-[#F5F5F0]/[0.02] p-3.5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[#F5F5F0] truncate">{tx.title}</p>
                        <p className="text-[10px] text-[#F5F5F0]/30 mt-0.5">
                          {new Date(tx.date).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-[14px] font-bold text-[#F5F5F0]">{formatCurrency(tx.amount)}</p>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                          <StatusIcon className="h-2.5 w-2.5" />
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    {/* Transaction details */}
                    <div className="border-t border-[#F5F5F0]/[0.05] pt-2 mt-2 space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[#F5F5F0]/30">{t('commission')}</span>
                        <span className="text-red-400/70">-{formatCurrency(tx.commission)}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[#F5F5F0]/30">{t('netAmount')}</span>
                        <span className="text-emerald-400 font-medium">{formatCurrency(tx.net)}</span>
                      </div>
                      {tx.blockchainHash && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Link2 className="h-2.5 w-2.5 text-purple-400" />
                          <a
                            href={`https://polygonscan.com/tx/${tx.blockchainHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] text-purple-400 font-mono truncate"
                          >
                            {tx.blockchainHash.slice(0, 10)}...{tx.blockchainHash.slice(-8)}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Action buttons based on status */}
                    {tx.status === 'confirmed' && tx.type === 'sale' && (
                      <button className="mt-2.5 w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20 py-2 text-[11px] font-medium text-emerald-400 active:opacity-80 transition-opacity">
                        <ArrowUpRight className="h-3 w-3" />
                        {t('claimFunds')}
                      </button>
                    )}
                    {tx.status === 'pending' && tx.type === 'purchase' && (
                      <button className="mt-2.5 w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#B8D4E3]/10 border border-[#B8D4E3]/20 py-2 text-[11px] font-medium text-[#B8D4E3] active:opacity-80 transition-opacity">
                        <ShieldCheck className="h-3 w-3" />
                        {t('confirmReception')}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default function WalletPage() {
  return (
    <AuthGuard>
      <WalletContent />
    </AuthGuard>
  );
}
