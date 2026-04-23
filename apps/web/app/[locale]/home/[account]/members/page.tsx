import { PlusCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import {
  AccountInvitationsTable,
  AccountMembersTable,
  InviteMembersDialogContainer,
} from '@kit/team-accounts/components';
import { If } from '@kit/ui/if';

import { EnviroDashboardSectionHeader } from '~/components/enviro/dashboard';
import { EnviroButton } from '~/components/enviro/enviro-button';
import {
  EnviroCard,
  EnviroCardBody,
  EnviroCardHeader,
  EnviroCardTitle,
} from '~/components/enviro/enviro-card';

import { loadMembersPageData } from './_lib/server/members-page.loader';

interface TeamAccountMembersPageProps {
  params: Promise<{ account: string }>;
}

export const generateMetadata = async () => {
  const t = await getTranslations('teams');
  const title = t('members.pageTitle');

  return {
    title,
  };
};

async function TeamAccountMembersPage({ params }: TeamAccountMembersPageProps) {
  const client = getSupabaseServerClient();
  const slug = (await params).account;
  const tCommon = await getTranslations('common');
  const tTeams = await getTranslations('teams');

  const [members, invitations, canAddMember, { user, account }] =
    await loadMembersPageData(client, slug);

  const canManageRoles = account.permissions.includes('roles.manage');
  const canManageInvitations = account.permissions.includes('invites.manage');

  const isPrimaryOwner = account.primary_owner_user_id === user.id;
  const currentUserRoleHierarchy = account.role_hierarchy_level;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 lg:px-8 lg:py-12">
      <EnviroDashboardSectionHeader
        tag={tCommon('routes.settings')}
        title={tCommon('accountMembers')}
        subtitle={tCommon('membersTabDescription')}
        actions={
          <If condition={canManageInvitations && canAddMember}>
            <InviteMembersDialogContainer
              userRoleHierarchy={currentUserRoleHierarchy}
              accountSlug={account.slug}
            >
              <EnviroButton
                variant="primary"
                size="sm"
                data-test="invite-members-form-trigger"
              >
                <PlusCircle aria-hidden="true" className="h-4 w-4" />
                <span>{tTeams('inviteMembersButton')}</span>
              </EnviroButton>
            </InviteMembersDialogContainer>
          </If>
        }
      />

      <EnviroCard variant="cream" hover="none" padding="md">
        <EnviroCardHeader>
          <EnviroCardTitle>{tCommon('accountMembers')}</EnviroCardTitle>
        </EnviroCardHeader>

        <EnviroCardBody className="mt-4">
          <AccountMembersTable
            userRoleHierarchy={currentUserRoleHierarchy}
            currentUserId={user.id}
            currentAccountId={account.id}
            members={members}
            isPrimaryOwner={isPrimaryOwner}
            canManageRoles={canManageRoles}
          />
        </EnviroCardBody>
      </EnviroCard>

      <EnviroCard variant="cream" hover="none" padding="md">
        <EnviroCardHeader>
          <EnviroCardTitle>
            {tTeams('pendingInvitesHeading')}
          </EnviroCardTitle>
        </EnviroCardHeader>

        <EnviroCardBody className="mt-4">
          <AccountInvitationsTable
            permissions={{
              canUpdateInvitation: canManageRoles,
              canRemoveInvitation: canManageRoles,
              currentUserRoleHierarchy,
            }}
            invitations={invitations}
          />
        </EnviroCardBody>
      </EnviroCard>
    </div>
  );
}

export default TeamAccountMembersPage;
