'use client';

import { useState } from 'react';

import ActionDropdown from '@/components/ActionDropdown';
import AutoCompleteSearch from '@/components/AutoCompleteSearch';
import OrgChart from '@/components/OrgChart';

const LandingPage = () => {
  const [search, setSearch] = useState<TreeNode | null>(null);
  return (
    <div className="mt-8 rounded-xl bg-card p-5">
      <div className="card mx-auto flex max-w-screen-lg items-end justify-between gap-3 py-5">
        <AutoCompleteSearch query={setSearch} />
        <div>
          <ActionDropdown />
        </div>
      </div>
      <OrgChart query={search} />
    </div>
  );
};

export { LandingPage };
