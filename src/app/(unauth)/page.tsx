import { unstable_setRequestLocale } from 'next-intl/server';

import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { LandingPage } from '@/features/landing/Page';

export async function generateMetadata() {
  return {
    title: 'Home | Employee Tree',
    description: 'Employee Tree',
  };
}

export default function IndexPage(props: { params: { locale: string } }) {
  unstable_setRequestLocale(props.params.locale);

  return (
    <>
      <Navbar />
      <LandingPage />
      <Footer />
    </>
  );
}
