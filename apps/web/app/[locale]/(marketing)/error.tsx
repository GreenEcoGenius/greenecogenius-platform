'use client';

import { useCaptureException } from '@kit/monitoring/hooks';

import { ErrorPageContent } from '~/components/error-page-content';

const MarketingErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useCaptureException(error);

  return (
    <div className={'flex h-screen flex-1 flex-col items-center justify-center'}>
      <ErrorPageContent
        statusCode={'common.errorPageHeading'}
        heading={'common.genericError'}
        subtitle={'common.genericErrorSubHeading'}
        backLabel={'common.goBack'}
        reset={reset}
      />
    </div>
  );
};

export default MarketingErrorPage;
