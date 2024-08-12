/* eslint-disable consistent-return */
import { useState } from 'react';

import { useColorRandom } from './UseColorRandom';

/**
 * React Hook to hierarchy element.
 * @hook
 */
export const useHierarchy = () => {
  const [hierarchy, setHierarchy] = useState<TreeNode | null | string>(null);
  const { getRandomColor } = useColorRandom();

  // Build hierarchy upwards from the target employee
  const buildHierarchyUpwards = (
    employee: TreeNode | null,
    employeeMap: Map<any, any>,
  ) => {
    if (!employee) return null;

    // If employee has a manager, find the manager
    const parent = employeeMap.get(employee.managerId);

    // Attach the current employee as a child to the parent
    if (parent) {
      parent.expanded = true;
      parent.children.push({
        ...employee,
        expanded: !!employee.children.length,
      });
      return buildHierarchyUpwards(parent, employeeMap);
    }
    // If there's no parent, this is the root
    setHierarchy({ ...employee, expanded: true });
    return { ...employee, expanded: true };
  };

  const buildHierarchy = (employees: TreeNode[], targetName: string) => {
    const checkRows = [...employees].filter(
      (employee) => employee.name.toLowerCase() === targetName.toLowerCase(),
    );
    if (checkRows.length > 1) {
      const managers = checkRows.map((row) => {
        const manager = [...employees].filter(
          (employee) => employee.id === row.managerId,
        )[0];
        return manager?.name || '';
      });
      setHierarchy(
        `Unable to process employee tree. ${targetName} has multiple managers: ${managers.join(', ')}`,
      );
      return;
    }
    const employeeMap = new Map();
    // Find the target employee
    let targetEmployee: any = null;
    // Map all employees by their IDs
    employees.map((employee: TreeNode, i: number) => {
      employee.children = [];
      const color = getRandomColor();
      const objEmployee = {
        ...employee,
        type: 'person',
        className: `${color} text-white`,
        style: { borderRadius: '12px' },
        data: {
          image: `https://randomuser.me/api/portraits/women/${i + 1}.jpg`,
          name: employee.name.toUpperCase(),
        },
      };
      employeeMap.set(employee.id, objEmployee);

      if (employee.name.toLowerCase() === targetName.toLowerCase()) {
        targetEmployee = objEmployee;
      }
    });

    if (targetEmployee) {
      const checkDirectReports = [...employees].filter(
        (employee) => employee.managerId === targetEmployee.id,
      );
      if (!targetEmployee.managerId && checkDirectReports.length < 1) {
        setHierarchy(
          `Unable to process employeee hierarchy. ${targetEmployee.name} not having hierarchy`,
        );
        return;
      }
    }

    return buildHierarchyUpwards(targetEmployee, employeeMap);
  };

  return { hierarchy, buildHierarchy };
};
