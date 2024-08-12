/* eslint-disable @typescript-eslint/no-shadow */

'use client';

import { AutoComplete } from 'primereact/autocomplete';
import React, { useCallback, useEffect, useState } from 'react';

import { useEmployee } from '@/hooks/UseEmployee';

import { Label } from './ui/label';

export default function AutoCompleteSearch({ query }: { query: Function }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState<
    Employees[] | undefined
  >(undefined);
  const [searched, setSearched] = useState(0);
  const { getEmployeeAutoComplete, employeeLists } = useEmployee();

  const search = useCallback(
    (event: { query: string }) => {
      setTimeout(() => {
        let filteredEmployees: Employees[];

        if (!event.query.trim().length) {
          filteredEmployees = [...employeeLists];
        } else {
          filteredEmployees = employeeLists.filter((employee: Employees) => {
            return employee.name
              .toLowerCase()
              .startsWith(event.query.toLowerCase());
          });
        }

        setFilteredEmployees(
          filteredEmployees.length < 1
            ? [
                {
                  name: 'Not found',
                  disabled: true,
                },
              ]
            : filteredEmployees,
        );
      }, 250);
    },
    [employeeLists],
  );

  useEffect(() => {
    const getEmployee = async () => {
      await getEmployeeAutoComplete();
    };
    const timer = setTimeout(() => {
      getEmployee();
    }, 10);

    return () => clearTimeout(timer);
  }, [searched]);

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
