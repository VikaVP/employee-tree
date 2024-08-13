'use client';

import { AutoComplete } from 'primereact/autocomplete';
import React, { useState } from 'react';

import { useAutoComplete } from '@/hooks/UseAutoComplete';

import { Label } from './ui/label';

export default function AutoCompleteSearch({ query }: { query: Function }) {
  const [searched, setSearched] = useState(0);
  const { selectedEmployee, setSelectedEmployee, filteredEmployees, search } =
    useAutoComplete(searched);

  return (
    <div className="card flex flex-col gap-2">
      <Label htmlFor="name">Search Employee</Label>
      <AutoComplete
        field="name"
        value={selectedEmployee}
        suggestions={filteredEmployees}
        completeMethod={search}
        onFocus={() => setSearched(searched + 1)}
        onChange={(e) => (setSelectedEmployee(e.value), query(e.value))}
        placeholder="Select an employee to see hierarchy tree"
      />
    </div>
  );
}
