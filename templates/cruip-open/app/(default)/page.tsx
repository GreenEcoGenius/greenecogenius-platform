export const metadata = {
  title: 'Home - Open PRO',
  description: 'Page description',
};

import Cta from '@/components/cta';
import Features from '@/components/features';
import Hero from '@/components/hero-home';
import PageIllustration from '@/components/page-illustration';
import Testimonials from '@/components/testimonials';
import Workflows from '@/components/workflows';

export default function Home() {
  return (
    <>
      <PageIllustration />
      <Hero />
      <Workflows />
      <Features />
      <Testimonials />
      <Cta />
    </>
  );
}
