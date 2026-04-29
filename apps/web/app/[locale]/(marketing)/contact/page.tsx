import { getTranslations } from 'next-intl/server';

import { Heading } from '@kit/ui/heading';
import { Trans } from '@kit/ui/trans';

import { SitePageHeader } from '~/(marketing)/_components/site-page-header';
import { ContactForm } from '~/(marketing)/contact/_components/contact-form';

export async function generateMetadata() {
  const t = await getTranslations('marketing');

  return {
    title: t('contact'),
  };
}

async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const t = await getTranslations('marketing');
  const { subject } = await searchParams;

  const defaultMessage = subject ? `[${subject}]\n\n` : undefined;

  return (
    <div>
      <SitePageHeader title={t(`contact`)} subtitle={t(`contactDescription`)} />

      <div className={'container mx-auto'}>
        <div
          className={'flex flex-1 flex-col items-center justify-center py-8'}
        >
          <div
            className={
              'border-metal-chrome flex w-full max-w-lg flex-col space-y-4 rounded-xl border bg-card p-8'
            }
          >
            <div>
              <Heading level={3}>
                <span className="text-metal-900">
                  <Trans i18nKey={'marketing.contactHeading'} />
                </span>
              </Heading>

              <p className={'text-metal-600'}>
                <Trans i18nKey={'marketing.contactSubheading'} />
              </p>
            </div>

            <ContactForm defaultMessage={defaultMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
