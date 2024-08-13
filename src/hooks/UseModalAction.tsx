import { useEffect, useState } from 'react';

import { useEmployee } from './UseEmployee';

/**
 * React Hook to modal component.
 * @hook
 */
export const useModalAction = (open: boolean, type: string, click: any) => {
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeOptions | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<
    EmployeeOptions[] | null
  >(null);
  const [name, setName] = useState('');
  const [selectedManager, setSelectedManager] =
    useState<EmployeeOptions | null>(null);
  const { getEmployeeOptions, employeeOptions } = useEmployee();

  useEffect(() => {
    const getEmployee = async () => {
      await getEmployeeOptions();
    };
    const timer = setTimeout(() => {
      setName('');
      setSelectedManager(null);
      setSelectedEmployee(null);
      setSelectedEmployees(null);
      getEmployee();
    }, 10);

    return () => clearTimeout(timer);
  }, [open]);

  const handleSubmit = () => {
    const data =
      type === 'new'
        ? {
            name,
            managerId: selectedManager?.value,
          }
        : type === 'edit'
          ? {
              name: selectedEmployee?.label,
              id: selectedEmployee?.value,
              managerId: selectedManager?.value,
            }
          : selectedEmployees?.map((dt) => {
              return +dt.value;
            });
    click && click(data);
  };

  return {
    selectedEmployee,
    setSelectedEmployee,
    selectedEmployees,
    setSelectedEmployees,
    name,
    setName,
    selectedManager,
    setSelectedManager,
    employeeOptions,
    handleSubmit,
  };
};
