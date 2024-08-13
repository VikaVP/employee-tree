import { useCallback, useEffect, useState } from 'react';

import { useEmployee } from './UseEmployee';
/**
 * React Hook to Auto complete component.
 * @hook
 */
export const useAutoComplete = (searched: number) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employees | null>(
    null,
  );
  const [filteredEmployees, setFilteredEmployees] = useState<
    Employees[] | undefined
  >(undefined);
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

  return { selectedEmployee, setSelectedEmployee, filteredEmployees, search };
};
