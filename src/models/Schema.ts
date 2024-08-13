'use client';

import EmployeeDummy from '@/public/assets/json/employee.json';

const checkIdDuplicated = (id: number, data: TreeNode[]) => {
  const isExist = [...data].filter((dt) => +dt.id === id);
  if (isExist.length) {
    return checkIdDuplicated(id + 1, data);
  }
  return id;
};

export const employeeSchema = {
  getData() {
    const datas = localStorage.getItem('employee');
    if (datas) {
      return JSON.parse(datas);
    }
    localStorage.setItem('employee', JSON.stringify(EmployeeDummy));
    return EmployeeDummy;
  },
  addData({ managerId, name }: EmployeeField) {
    const datas = localStorage.getItem('employee');
    if (datas) {
      const parsed = JSON.parse(datas);
      const id = checkIdDuplicated(parsed.length + 1, parsed);
      const newData = {
        id,
        name,
        managerId,
      };
      localStorage.setItem('employee', JSON.stringify([...parsed, newData]));
      return newData;
    }
    return `Cant't get data`;
  },

  updateData({ managerId, name, id }: EmployeeField) {
    const datas = localStorage.getItem('employee');
    if (datas && id) {
      const parse = JSON.parse(datas);
      const isExist = [...parse].filter(
        (dt: EmployeeField) => +(dt?.id || 0) === +id,
      );

      if (isExist.length > 0) {
        const updatedData = [...parse].map((dt: EmployeeField) => {
          if (dt.id === id) {
            return {
              id,
              managerId,
              name,
            };
          }
          return dt;
        });

        localStorage.setItem('employee', JSON.stringify(updatedData));
        return {
          id,
          managerId,
          name,
        };
      }
      return 'Data not found';
    }
    return `Cant't get data`;
  },

  deleteDatas(data: number[]) {
    const datas = localStorage.getItem('employee');
    if (datas) {
      const parse = JSON.parse(datas);
      const filtered = [...parse].filter(
        (dt: EmployeeField) => dt.id && !data.includes(dt.id),
      );
      localStorage.setItem('employee', JSON.stringify(filtered));
      return filtered;
    }
    return `Cant't get data`;
  },
};
