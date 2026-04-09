import { ESGFormWizard } from '../data-entry/_components/esg-form-wizard';

export default async function ESGWizardPage(props: {
  searchParams: Promise<{ step?: string }>;
}) {
  const searchParams = await props.searchParams;
  const stepParam = searchParams.step;
  const initialStep = stepParam ? parseInt(stepParam, 10) : undefined;

  return <ESGFormWizard initialStep={initialStep} />;
}
