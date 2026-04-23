import { getLocale, getTranslations } from 'next-intl/server';

import {
  ENVIRO_DOCS_SIDEBAR_WIDTH,
  EnviroDocsHeader,
  EnviroDocsSidebar,
  EnviroDocsSidebarProvider,
  EnviroFloatingDocsNavButton,
} from '~/components/enviro/docs';

import { getDocs } from './_lib/server/docs.loader';
import { buildDocumentationTree } from './_lib/utils';

type DocsLayoutProps = React.PropsWithChildren<{
  params: Promise<{ locale?: string }>;
}>;

async function DocsLayout({ children, params }: DocsLayoutProps) {
  let { locale } = await params;

  if (!locale) {
    locale = await getLocale();
  }

  const t = await getTranslations('docs');

  return (
    <EnviroDocsSidebarProvider>
      <div className="relative flex min-h-dvh w-full bg-[--color-enviro-bg] text-[--color-enviro-fg] font-[family-name:var(--font-enviro-sans)]">
        <DocsSidebar locale={locale} />

        <div
          data-enviro-docs-shell-main
          className="flex min-h-dvh w-full flex-1 flex-col"
          style={
            {
              ['--enviro-docs-sidebar-offset' as string]:
                ENVIRO_DOCS_SIDEBAR_WIDTH,
            } as React.CSSProperties
          }
        >
          <style>{`
            [data-enviro-docs-shell-main] { padding-left: 0; }
            @media (min-width: 1024px) {
              [data-enviro-docs-shell-main] { padding-left: var(--enviro-docs-sidebar-offset, 0); }
            }
          `}</style>

          <EnviroDocsHeader
            docsLinkLabel={t('header.breadcrumbDocs')}
            backLabel={t('header.backToSite')}
          />

          <main className="relative flex-1 overflow-x-hidden">{children}</main>
        </div>

        <EnviroFloatingDocsNavButton ariaLabel={t('sidebar.openMenu')} />
      </div>
    </EnviroDocsSidebarProvider>
  );
}

async function DocsSidebar({ locale }: { locale: string }) {
  const t = await getTranslations('docs');
  const pages = await getDocs(locale);
  const tree = buildDocumentationTree(pages);

  return (
    <EnviroDocsSidebar
      heading={t('sidebar.title')}
      pages={tree}
      closeLabel={t('sidebar.closeMenu')}
      emptyStateLabel={t('sidebar.emptyState')}
    />
  );
}

export default DocsLayout;
