import { vi } from 'vitest';

import { employeeSchema } from '../../../src/models/Schema';
import { EmployeeService } from '../../../src/services/EmployeeService';

vi.mock('../../../src/models/Schema', () => ({
  employeeSchema: {
    getData: vi.fn(),
    addData: vi.fn(),
    updateData: vi.fn(),
    deleteDatas: vi.fn(),
  },
}));

describe('EmployeeService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getEmployees', () => {
    it('should retrieve the list of employees', async () => {
      const mockEmployees = [{ id: 1, name: 'A', managerId: null }];
      (employeeSchema.getData as any).mockResolvedValue(mockEmployees);

      const employees = await EmployeeService.getEmployees();
      expect(employeeSchema.getData).toHaveBeenCalled();
      expect(employees).toEqual(mockEmployees);
    });
  });

  describe('addEmployee', () => {
    it('should add a new employee', async () => {
      const mockEmployee = { id: 2, name: 'B', managerId: 1 };
      (employeeSchema.addData as any).mockResolvedValue(mockEmployee);

      const result = await EmployeeService.addEmployee(mockEmployee);
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('updateEmployee', () => {
    it('should update an existing employee', async () => {
      const mockEmployee = { id: 1, name: 'C', managerId: null };
      (employeeSchema.updateData as any).mockResolvedValue(mockEmployee);

      const result = await EmployeeService.updateEmployee(mockEmployee);
      expect(employeeSchema.updateData).toHaveBeenCalledWith(mockEmployee);
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('deleteEmployees', () => {
    it('should delete employees by their IDs', async () => {
      const mockIds = [1, 2];
      (employeeSchema.deleteDatas as any).mockResolvedValue(mockIds);

      const result = await EmployeeService.deleteEmployees(mockIds);
      expect(employeeSchema.deleteDatas).toHaveBeenCalledWith(mockIds);
      expect(result).toEqual(mockIds);
    });
  });
});
