import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useEmployee } from '../../../src/hooks/UseEmployee';
import { EmployeeService } from '../../../src/services/EmployeeService';

// Mocking the EmployeeService
vi.mock('../../../src/services/EmployeeService');

describe('UseEmployee', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear any previous mocks
  });

  it('should initialize with empty employeeLists and employeeOptions', () => {
    const { result } = renderHook(() => useEmployee());

    expect(result.current.employeeLists).toEqual([]);
    expect(result.current.employeeOptions).toEqual([]);
  });

  it('should fetch and set employee data for autoComplete', async () => {
    const mockData = [
      { id: 1, name: 'Name 1', managerId: 3 },
      { id: 2, name: 'Name 2', managerId: 3 },
    ];

    // Mock the getEmployees method
    (EmployeeService.getEmployees as any).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useEmployee());

    await act(async () => {
      const autoCompleteData = await result.current.getEmployeeAutoComplete();
      expect(autoCompleteData).toEqual([
        { id: 1, name: 'Name 1', value: 1 },
        { id: 2, name: 'Name 2', value: 2 },
      ]);
    });

    expect(result.current.employeeLists).toEqual([
      { id: 1, name: 'Name 1', value: 1 },
      { id: 2, name: 'Name 2', value: 2 },
    ]);
  });

  it('should fetch and set employee options', async () => {
    const mockData = [
      { id: 1, name: 'Name 1', managerId: 3 },
      { id: 2, name: 'Name 2', managerId: 3 },
    ];

    // Mock the getEmployees method
    (EmployeeService.getEmployees as any).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useEmployee());

    await act(async () => {
      const optionsData = await result.current.getEmployeeOptions();
      expect(optionsData).toEqual([
        { label: 'Name 1', value: '1' },
        { label: 'Name 2', value: '2' },
      ]);
    });

    expect(result.current.employeeOptions).toEqual([
      { label: 'Name 1', value: '1' },
      { label: 'Name 2', value: '2' },
    ]);
  });

  it('should handle errors in getDatas', async () => {
    // Mock the getEmployees method to reject the promise
    (EmployeeService.getEmployees as any).mockRejectedValueOnce(
      new Error('Failed to fetch'),
    );

    const { result } = renderHook(() => useEmployee());

    await act(async () => {
      const data = await result.current.getDatas();
      expect(data).toEqual([]); // Should return an empty array on error
    });
  });
});
