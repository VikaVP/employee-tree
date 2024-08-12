import { vi } from 'vitest';

import EmployeeDummy from '../../../public/assets/json/employee.json';
import { employeeSchema } from '../../../src/models/Schema';

describe('employeeSchema', () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    globalThis.localStorage = localStorageMock as any;
    // Clear any existing localStorage data before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Restore the original implementations
    vi.restoreAllMocks();
  });

  describe('getData', () => {
    it('should return data from localStorage if available', () => {
      const mockData = JSON.stringify([{ id: 1, name: 'A', managerId: null }]);
      (localStorage.getItem as any).mockReturnValue(mockData);

      const result = employeeSchema.getData();

      expect(localStorage.getItem).toHaveBeenCalledWith('employee');
      expect(result).toEqual(JSON.parse(mockData));
    });

    it('should return EmployeeDummy and set it in localStorage if data is not available', () => {
      (localStorage.getItem as any).mockReturnValue(null);

      const result = employeeSchema.getData();

      expect(localStorage.getItem).toHaveBeenCalledWith('employee');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'employee',
        JSON.stringify(EmployeeDummy),
      );
      expect(result).toEqual(EmployeeDummy);
    });
  });

  describe('addData', () => {
    it('should add a new employee to localStorage', () => {
      const mockData = [{ id: 1, name: 'A', managerId: null }];
      (localStorage.getItem as any).mockReturnValue(JSON.stringify(mockData));

      const newEmployee = { managerId: 1, name: 'B' };
      const result = employeeSchema.addData(newEmployee);

      expect(localStorage.getItem).toHaveBeenCalledWith('employee');
      expect(result).toEqual({ id: 2, managerId: 1, name: 'B' });
    });

    it("should return an error message if localStorage data can't be retrieved", () => {
      (localStorage.getItem as any).mockReturnValue(null);

      const result = employeeSchema.addData({ managerId: 1, name: 'B' });

      expect(result).toBe("Cant't get data");
    });
  });

  describe('updateData', () => {
    it('should update an existing employee in localStorage', () => {
      const mockData = [{ id: 1, name: 'A', managerId: null }];
      (localStorage.getItem as any).mockReturnValue(JSON.stringify(mockData));

      const updatedEmployee = { id: 1, managerId: 2, name: 'C' };
      const result = employeeSchema.updateData(updatedEmployee);

      const expectedData = [{ id: 1, managerId: 2, name: 'C' }];
      expect(localStorage.getItem).toHaveBeenCalledWith('employee');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'employee',
        JSON.stringify(expectedData),
      );
      expect(result).toEqual(updatedEmployee);
    });

    it('should return an error message if the employee is not found', () => {
      const mockData = [{ id: 1, name: 'A', managerId: null }];
      (localStorage.getItem as any).mockReturnValue(JSON.stringify(mockData));

      const result = employeeSchema.updateData({
        id: 5,
        managerId: 3,
        name: 'B',
      });

      expect(result).toBe('Data not found');
    });

    it("should return an error message if localStorage data can't be retrieved", () => {
      (localStorage.getItem as any).mockReturnValue(null);

      const result = employeeSchema.updateData({
        id: 1,
        managerId: 1,
        name: 'A',
      });

      expect(result).toBe("Cant't get data");
    });
  });

  describe('deleteDatas', () => {
    it('should delete employees by their IDs from localStorage', () => {
      const mockData = [
        { id: 1, name: 'A', managerId: null },
        { id: 2, name: 'B', managerId: 1 },
      ];
      (localStorage.getItem as any).mockReturnValue(JSON.stringify(mockData));

      const result = employeeSchema.deleteDatas([1]);

      const expectedData = [{ id: 2, name: 'B', managerId: 1 }];
      expect(localStorage.getItem).toHaveBeenCalledWith('employee');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'employee',
        JSON.stringify(expectedData),
      );
      expect(result).toEqual(expectedData);
    });

    it("should return an error message if localStorage data can't be retrieved", () => {
      (localStorage.getItem as any).mockReturnValue(null);

      const result = employeeSchema.deleteDatas([1]);

      expect(result).toBe("Cant't get data");
    });
  });
});
