'use client';

import { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

import { ESGFormWizard } from '../data-entry/_components/esg-form-wizard';

function WizardWithParams() {
  const searchParams = useSearchParams();
  const stepParam = searchParams.get('step');
  const initialStep = stepParam ? parseInt(stepParam, 10) : undefined;

  return <ESGFormWizard initialStep={initialStep} />;
}

export default function ESGWizardPage() {
  return (
    <Suspense>
      <WizardWithParams />
    </Suspense>
  );
}
