import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useAutoComplete } from '../../../src/hooks/UseAutoComplete';
import { useEmployee } from '../../../src/hooks/UseEmployee';

vi.mock('../../../src/hooks/UseEmployee', () => ({
  useEmployee: vi.fn(),
}));

describe('UseAutoComplete', () => {
  const mockGetEmployeeAutoComplete = vi.fn();
  const mockEmployeeLists = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useEmployee as any).mockReturnValue({
      getEmployeeAutoComplete: mockGetEmployeeAutoComplete,
      employeeLists: mockEmployeeLists,
    });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useAutoComplete(0));

    expect(result.current.selectedEmployee).toBeNull();
    expect(result.current.filteredEmployees).toBeUndefined();
  });

  it('should trigger getEmployeeAutoComplete on first render', async () => {
    renderHook(() => useAutoComplete(0));
    await waitFor(() => {
      expect(mockGetEmployeeAutoComplete).toHaveBeenCalledTimes(1);
    });
  });

  it('should filter employees based on search query', async () => {
    const { result } = renderHook(() => useAutoComplete(0));

    await act(async () => {
      result.current.search({ query: 'A' });
    });
    await waitFor(() => {
      expect(result.current.filteredEmployees).toEqual([{ id: 1, name: 'A' }]);
    });

    await act(async () => {
      result.current.search({ query: 'B' });
    });
    await waitFor(() => {
      expect(result.current.filteredEmployees).toEqual([{ id: 2, name: 'B' }]);
    });

    await act(async () => {
      result.current.search({ query: 'test' });
    });
    await waitFor(() => {
      expect(result.current.filteredEmployees).toEqual([
        { name: 'Not found', disabled: true },
      ]);
    });
  });

  it('should reset filteredEmployees when search query is empty', async () => {
    const { result } = renderHook(() => useAutoComplete(0));

    await act(async () => {
      result.current.search({ query: '' });
    });
    await waitFor(() => {
      expect(result.current.filteredEmployees).toEqual(mockEmployeeLists);
    });
  });

  it('should update selectedEmployee', async () => {
    const { result } = renderHook(() => useAutoComplete(0));

    act(() => {
      result.current.setSelectedEmployee({ id: 2, name: 'B' });
    });
    await waitFor(() => {
      expect(result.current.selectedEmployee).toEqual({ id: 2, name: 'B' });
    });
  });

  it('should re-trigger getEmployeeAutoComplete when "searched" value updated', async () => {
    const { rerender } = renderHook(
      ({ searched }) => useAutoComplete(searched),
      {
        initialProps: { searched: 0 },
      },
    );
    await waitFor(() => {
      expect(mockGetEmployeeAutoComplete).toHaveBeenCalledTimes(1);
    });

    rerender({ searched: 1 });

    await waitFor(() => {
      expect(mockGetEmployeeAutoComplete).toHaveBeenCalledTimes(2);
    });
  });
});
