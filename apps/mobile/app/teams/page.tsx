'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Users, Plus, ChevronRight, Shield, UserPlus, Mail } from 'lucide-react';
import { AuthGuard } from '~/components/auth-guard';
import { AppShell } from '~/components/app-shell';
import { supabase } from '~/lib/supabase-client';

interface TeamMember {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

interface Team {
  id: string;
  name: string;
  slug: string;
  is_personal_account: boolean;
  members: TeamMember[];
}

function TeamsContent() {
  const t = useTranslations('teams');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: memberships } = await supabase
        .from('accounts_memberships')
        .select('account_id, account_role')
        .eq('user_id', user.id);

      if (!memberships || memberships.length === 0) {
        setTeams([]);
        return;
      }

      const accountIds = memberships.map((m) => m.account_id);
      const { data: accounts } = await supabase
        .from('accounts')
        .select('id, name, slug, is_personal_account')
        .in('id', accountIds);

      const teamAccounts = (accounts ?? []).filter((a) => !a.is_personal_account);

      const teamsWithMembers: Team[] = await Promise.all(
        teamAccounts.map(async (account) => {
          const { data: members } = await supabase
            .from('accounts_memberships')
            .select('user_id, account_role, created_at')
            .eq('account_id', account.id);

          return {
            ...account,
            members: (members ?? []).map((m) => ({
              id: m.user_id,
              email: '',
              role: m.account_role,
              created_at: m.created_at,
            })),
          };
        }),
      );

      setTeams(teamsWithMembers);
    } catch (err) {
      console.error('Failed to load teams:', err);
    } finally {
      setLoading(false);
    }
  }

  const roleColors: Record<string, string> = {
    owner: '#F59E0B',
    admin: '#B8D4E3',
    member: '#6EE7B7',
  };

  return (
    <AppShell
      title={t('title')}
      subtitle={t('subtitle')}
      rightAction={
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B8D4E3] text-[#0A2F1F] active:opacity-80 transition-opacity"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </button>
      }
    >
      <div className="space-y-5 pb-4">
        {/* Invite form */}
        {showInvite && (
          <div className="glass-card rounded-2xl p-4 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <UserPlus className="h-4 w-4 text-[#B8D4E3]" />
              <h3 className="text-[13px] font-semibold text-[#F5F5F0]">Inviter un membre</h3>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F5F5F0]/30" />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@exemple.com"
                  className="w-full rounded-xl border border-[#F5F5F0]/[0.08] bg-[#F5F5F0]/[0.04] py-2.5 pl-9 pr-3 text-[13px] text-[#F5F5F0] placeholder:text-[#F5F5F0]/30 focus:border-[#B8D4E3]/30 focus:outline-none"
                />
              </div>
              <button className="shrink-0 rounded-xl bg-[#B8D4E3] px-4 py-2.5 text-[13px] font-medium text-[#0A2F1F] active:opacity-80 transition-opacity">
                Inviter
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl glass-card" />
            ))}
          </div>
        ) : teams.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B8D4E3]/10">
              <Users className="h-6 w-6 text-[#B8D4E3]/60" />
            </div>
            <p className="text-[14px] font-medium text-[#F5F5F0]/70">Aucune équipe</p>
            <p className="mt-1 text-[12px] text-[#F5F5F0]/40 max-w-[240px] mx-auto">
              {t('empty')}
            </p>
            <button className="mt-4 rounded-xl bg-[#B8D4E3] px-5 py-2.5 text-[13px] font-medium text-[#0A2F1F] active:opacity-80 transition-opacity">
              Créer une équipe
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {teams.map((team) => (
              <div key={team.id} className="glass-card rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B8D4E3]/15">
                    <Users className="h-5 w-5 text-[#B8D4E3]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#F5F5F0]">{team.name}</p>
                    <p className="text-[11px] text-[#F5F5F0]/40">
                      {team.members.length} membre{team.members.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#F5F5F0]/20" />
                </div>
                {team.members.length > 0 && (
                  <div className="border-t border-[#F5F5F0]/[0.05] px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      {team.members.slice(0, 5).map((member, i) => (
                        <div
                          key={member.id}
                          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0A2F1F]"
                          style={{
                            backgroundColor: `${roleColors[member.role] || '#B8D4E3'}25`,
                            marginLeft: i > 0 ? '-4px' : '0',
                          }}
                        >
                          <Shield className="h-3 w-3" style={{ color: roleColors[member.role] || '#B8D4E3' }} />
                        </div>
                      ))}
                      {team.members.length > 5 && (
                        <span className="ml-1 text-[10px] text-[#F5F5F0]/40">
                          +{team.members.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function TeamsPage() {
  return (
    <AuthGuard>
      <TeamsContent />
    </AuthGuard>
  );
}
