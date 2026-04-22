import Link from 'next/link';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Trans } from '@kit/ui/trans';

import { EnviroButton } from '~/components/enviro';

interface ChangelogPaginationProps {
  currentPage: number;
  canGoToNextPage: boolean;
  canGoToPreviousPage: boolean;
}

export function ChangelogPagination({
  currentPage,
  canGoToNextPage,
  canGoToPreviousPage,
}: ChangelogPaginationProps) {
  const nextPage = currentPage + 1;
  const previousPage = currentPage - 1;

  return (
    <div className="flex items-center gap-3">
      {canGoToPreviousPage ? (
        <Link href={`/changelog?page=${previousPage}`}>
          <EnviroButton type="button" variant="secondary" size="sm">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            <Trans i18nKey="changelog.paginationPrevious" />
          </EnviroButton>
        </Link>
      ) : null}

      {canGoToNextPage ? (
        <Link href={`/changelog?page=${nextPage}`}>
          <EnviroButton type="button" variant="secondary" size="sm">
            <Trans i18nKey="changelog.paginationNext" />
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </EnviroButton>
        </Link>
      ) : null}
    </div>
  );
}
