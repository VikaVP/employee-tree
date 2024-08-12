import { employeeSchema } from '@/models/Schema';

export const EmployeeService = {
  getEmployees() {
    return Promise.resolve(employeeSchema.getData());
  },

  addEmployee({ managerId, name }: EmployeeField) {
    return Promise.resolve(employeeSchema.addData({ managerId, name }));
  },

  updateEmployee({ managerId, name, id }: EmployeeField) {
    return Promise.resolve(employeeSchema.updateData({ managerId, name, id }));
  },

  deleteEmployees(data: number[]) {
    return Promise.resolve(employeeSchema.deleteDatas(data));
  },
};
