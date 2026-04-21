'use client';

import { usePathname, useRouter } from 'next/navigation';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

import { EnviroButton } from '~/components/enviro';

export function BlogPagination(props: {
  currentPage: number;
  canGoToNextPage: boolean;
  canGoToPreviousPage: boolean;
}) {
  const navigate = useGoToPage();

  return (
    <div className="flex items-center gap-3">
      <If condition={props.canGoToPreviousPage}>
        <EnviroButton
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            navigate(props.currentPage - 1);
          }}
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          <Trans i18nKey="blog.paginationPrevious" />
        </EnviroButton>
      </If>

      <If condition={props.canGoToNextPage}>
        <EnviroButton
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            navigate(props.currentPage + 1);
          }}
        >
          <Trans i18nKey="blog.paginationNext" />
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </EnviroButton>
      </If>
    </div>
  );
}

function useGoToPage() {
  const router = useRouter();
  const path = usePathname();

  return (page: number) => {
    const searchParams = new URLSearchParams({
      page: page.toString(),
    });

    router.push(path + '?' + searchParams.toString());
  };
}
