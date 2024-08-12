import { Section } from '@/components/Section';

import { CenteredMenu } from './CenteredMenu';
import SparklesText from './magicui/sparkles-text';

const Navbar = () => {
  return (
    <Section className="fixed left-0 top-0 z-50 w-full -translate-y-2 border-b py-4 opacity-100 backdrop-blur-md">
      <CenteredMenu
        logo={<SparklesText text="Employee Tree" className="text-2xl" />}
      />
    </Section>
  );
};

export { Navbar };
