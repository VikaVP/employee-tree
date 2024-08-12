import { useState } from 'react';

import { EmployeeService } from '../services/EmployeeService';

/**
 * React Hook to manage employee data.
 * @hook
 */
export const useEmployee = () => {
  const [employeeLists, setEmployeeLists] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const getDatas = () => {
    const datas = EmployeeService.getEmployees()
      .then((data) => data)
      .catch((_err) => []);
    return datas;
  };
  const getEmployeeAutoComplete = async () => {
    const data = await getDatas();
    const mappingEmployees = data.map((dt: TreeNode) => {
      return {
        id: dt.id,
        name: dt.name,
        value: dt.id,
      };
    });
    setEmployeeLists(mappingEmployees);
    return mappingEmployees;
  };

  const getEmployeeOptions = async () => {
    const data = await getDatas();
    const mappingEmployees = data.map((dt: TreeNode) => {
      return {
        label: dt.name,
        value: String(dt.id),
      };
    });
    setEmployeeOptions(mappingEmployees);
    return mappingEmployees;
  };

  return {
    getEmployeeAutoComplete,
    employeeLists,
    getEmployeeOptions,
    employeeOptions,
    getDatas,
  };
};
