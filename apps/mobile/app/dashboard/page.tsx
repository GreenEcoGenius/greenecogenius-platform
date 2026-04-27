'use client';

import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';

function DashboardContent() {
  return (
    <AppShell title="Dashboard" subtitle="KPIs & analytics">
      <div className="space-y-4">
        <div className="rounded-2xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03] p-5">
          <h2 className="text-base font-semibold text-[#F5F5F0]">Chiffres clés</h2>
          <p className="mt-2 text-sm text-[#F5F5F0]/60">
            Connexion à l&apos;API analytics en cours d&apos;intégration. Les graphiques
            recharts arrivent au prochain sprint.
          </p>
        </div>
        <div className="rounded-2xl border border-[#F5F5F0]/10 bg-[#F5F5F0]/[0.03] p-5">
          <h2 className="text-base font-semibold text-[#F5F5F0]">Blockchain ledger</h2>
          <p className="mt-2 text-sm text-[#F5F5F0]/60">
            Réseau Polygon · Contrat actif · Dernière transaction il y a 2h
          </p>
        </div>
      </div>
    </AppShell>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
