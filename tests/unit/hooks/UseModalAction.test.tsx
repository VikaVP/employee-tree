import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useEmployee } from '../../../src/hooks/UseEmployee';
import { useModalAction } from '../../../src/hooks/UseModalAction';

vi.mock('../../../src/hooks/UseEmployee', () => ({
  useEmployee: vi.fn(),
}));

describe('UseModalAction', () => {
  const mockGetEmployeeOptions = vi.fn();
  const mockEmployeeOptions = [
    { label: 'A', value: 1 },
    { label: 'B', value: 2 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useEmployee as any).mockReturnValue({
      getEmployeeOptions: mockGetEmployeeOptions,
      employeeOptions: mockEmployeeOptions,
    });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useModalAction(false, 'new', vi.fn()));

    expect(result.current.selectedEmployee).toBeNull();
    expect(result.current.selectedEmployees).toBeNull();
    expect(result.current.name).toBe('');
    expect(result.current.selectedManager).toBeNull();
  });

  it('should reset state and call getEmployeeOptions when "open" changes', async () => {
    const { result, rerender } = renderHook(
      ({ open }) => useModalAction(open, 'new', vi.fn()),
      {
        initialProps: { open: false },
      },
    );

    rerender({ open: true });

    await act(() => {
      expect(result.current.name).toBe('');
      expect(result.current.selectedManager).toBeNull();
      expect(result.current.selectedEmployee).toBeNull();
      expect(result.current.selectedEmployees).toBeNull();
    });
    await waitFor(() => {
      expect(mockGetEmployeeOptions).toHaveBeenCalledTimes(1);
    });
  });

  it('should call click with correct data for "new" type', async () => {
    const mockClick = vi.fn();
    const { result } = renderHook(() => useModalAction(true, 'new', mockClick));

    act(() => {
      result.current.setName('Name 1');
      result.current.setSelectedManager(mockEmployeeOptions[0] as any);
    });

    act(() => {
      result.current.handleSubmit();
    });
    await waitFor(() => {
      expect(mockClick).toHaveBeenCalledWith({
        name: 'Name 1',
        managerId: 1,
      });
    });
  });

  it('should call click with correct data for "edit" type', async () => {
    const mockClick = vi.fn();
    const { result } = renderHook(() =>
      useModalAction(true, 'edit', mockClick),
    );

    act(() => {
      result.current.setSelectedEmployee(mockEmployeeOptions[1] as any);
      result.current.setSelectedManager(mockEmployeeOptions[0] as any);
    });

    act(() => {
      result.current.handleSubmit();
    });
    await waitFor(() => {
      expect(mockClick).toHaveBeenCalledWith({
        name: 'B',
        id: 2,
        managerId: 1,
      });
    });
  });

  it('should call click with correct data for "delete" type', async () => {
    const mockClick = vi.fn();
    const { result } = renderHook(() =>
      useModalAction(true, 'delete', mockClick),
    );

    act(() => {
      result.current.setSelectedEmployees([mockEmployeeOptions[1] as any]);
    });

    act(() => {
      result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(mockClick).toHaveBeenCalledWith([2]);
    });
  });
});
