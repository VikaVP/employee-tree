import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useActionDropdown } from '../../../src/hooks/UseActionDropdown';
import { EmployeeService } from '../../../src/services/EmployeeService';

describe('UseActionDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useActionDropdown());

    expect(result.current.modal).toBe('');
    expect(result.current.items).toHaveLength(3);
    expect(result.current.openModal).toBe(false);
  });

  it('should update modal when click triggrered', () => {
    const { result } = renderHook(() => useActionDropdown());
    // Simulate clicking 'New Employee'
    act(() => {
      (result.current.items[0] as any).command();
    });

    expect(result.current.modal).toBe('new');
    expect(result.current.openModal).toBe(true);
    // Simulate clicking 'Edit Employee'
    act(() => {
      (result.current.items[1] as any).command();
    });

    expect(result.current.modal).toBe('edit');
    expect(result.current.openModal).toBe(true);
  });

  it('should handle employee actions correctly based on modal', async () => {
    const addEmployeeMock = (
      vi.spyOn(EmployeeService, 'addEmployee') as any
    ).mockResolvedValue({});
    const updateEmployeeMock = (
      vi.spyOn(EmployeeService, 'updateEmployee') as any
    ).mockResolvedValue({});
    const deleteEmployeeMock = (
      vi.spyOn(EmployeeService, 'deleteEmployees') as any
    ).mockResolvedValue({});

    const { result } = renderHook(() => useActionDropdown());

    act(() => {
      result.current.setOpenModal(true);
      result.current.setModal('new');
    });

    await act(async () => {
      await result.current.handleClick({ name: 'A', managerId: 1 });
    });

    await waitFor(() => {
      expect(addEmployeeMock).toHaveBeenCalledWith({
        name: 'A',
        managerId: 1,
      });
    });
    expect(updateEmployeeMock).not.toHaveBeenCalled();
    expect(deleteEmployeeMock).not.toHaveBeenCalled();

    act(() => {
      result.current.setModal('edit');
    });

    await act(async () => {
      await result.current.handleClick({
        id: 1,
        name: 'A',
        managerId: 1,
      });
    });

    expect(updateEmployeeMock).toHaveBeenCalledWith({
      id: 1,
      name: 'A',
      managerId: 1,
    });
    // Ensures only one call was made to addEmployee
    expect(addEmployeeMock).toHaveBeenCalledTimes(1);
    expect(deleteEmployeeMock).not.toHaveBeenCalled();

    act(() => {
      result.current.setModal('delete');
    });

    await act(async () => {
      await result.current.handleClick([1]);
    });

    expect(deleteEmployeeMock).toHaveBeenCalledWith([1]);
  });

  it('should call toast with correct parameters on success or error', async () => {
    const showMock = vi.fn();
    const addEmployeeMock = (
      vi.spyOn(EmployeeService, 'addEmployee') as any
    ).mockResolvedValue({});
    const { result } = renderHook(() => useActionDropdown());

    act(() => {
      (result.current.toast as any).current = { show: showMock };
      result.current.setOpenModal(true);
      result.current.setModal('new');
    });

    await act(async () => {
      await result.current.handleClick({ name: 'A', managerId: 1 });
    });

    expect(showMock).toHaveBeenCalledWith({
      severity: 'success',
      detail: 'Success add employee',
    });

    // Simulate an error
    addEmployeeMock.mockResolvedValue('Error message');

    await act(async () => {
      await result.current.handleClick({ name: 'B', managerId: 2 });
    });

    expect(showMock).toHaveBeenCalledWith({
      severity: 'error',
      detail: 'Error message',
    });
  });
});
