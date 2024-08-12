'use client';

import Link from 'next/link';

const CenteredMenu = (props: { logo: React.ReactNode }) => {
  return (
    <div className="flex flex-wrap items-center justify-between">
      <Link href="/">{props.logo}</Link>
    </div>
  );
};

export { CenteredMenu };
