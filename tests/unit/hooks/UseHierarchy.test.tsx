import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useHierarchy } from '../../../src/hooks/UseHierarchy';

// Mock the useColorRandom hook
vi.mock('../../../src/hooks/UseColorRandom', () => ({
  useColorRandom: () => ({
    getRandomColor: () => 'bg-red-500', // Return a fixed color for testing
  }),
}));

describe('UseHierarchy', () => {
  it('should initialize with null hierarchy', () => {
    const { result } = renderHook(() => useHierarchy());

    expect(result.current.hierarchy).toBeNull();
  });

  it('should set hierarchy for a single employee with no managers', () => {
    const employees = [
      { id: 1, name: 'A', managerId: null, children: [] },
      { id: 2, name: 'B', managerId: 1, children: [] },
    ];

    const { result } = renderHook(() => useHierarchy());

    act(() => {
      result.current.buildHierarchy(employees, 'A');
    });

    expect(result.current.hierarchy).toEqual({
      id: 1,
      name: 'A',
      managerId: null,
      children: [],
      expanded: true,
      type: 'person',
      className: 'bg-red-500 text-white',
      style: { borderRadius: '12px' },
      data: {
        image: 'https://randomuser.me/api/portraits/women/1.jpg',
        name: 'A',
      },
    });
  });

  it('should build hierarchy with multiple levels', () => {
    const employees = [
      { id: 1, name: 'A', managerId: null, children: [] },
      { id: 2, name: 'B', managerId: 1, children: [] },
      { id: 3, name: 'C', managerId: 2, children: [] },
    ];

    const { result } = renderHook(() => useHierarchy());

    act(() => {
      result.current.buildHierarchy(employees, 'C');
    });

    expect(result.current.hierarchy).toEqual({
      id: 1,
      name: 'A',
      managerId: null,
      children: [
        {
          id: 2,
          name: 'B',
          managerId: 1,
          children: [
            {
              id: 3,
              name: 'C',
              managerId: 2,
              children: [],
              expanded: false,
              type: 'person',
              className: 'bg-red-500 text-white',
              style: { borderRadius: '12px' },
              data: {
                image: 'https://randomuser.me/api/portraits/women/3.jpg',
                name: 'C',
              },
            },
          ],
          expanded: true,
          type: 'person',
          className: 'bg-red-500 text-white',
          style: { borderRadius: '12px' },
          data: {
            image: 'https://randomuser.me/api/portraits/women/2.jpg',
            name: 'B',
          },
        },
      ],
      expanded: true,
      type: 'person',
      className: 'bg-red-500 text-white',
      style: { borderRadius: '12px' },
      data: {
        image: 'https://randomuser.me/api/portraits/women/1.jpg',
        name: 'A',
      },
    });
  });

  it('should handle an employee with multiple managers', () => {
    const employees = [
      { id: 1, name: 'A', managerId: null, children: [] },
      { id: 2, name: 'B', managerId: 1, children: [] },
      { id: 3, name: 'C', managerId: 2, children: [] },
      { id: 4, name: 'C', managerId: 1, children: [] },
    ];

    const { result } = renderHook(() => useHierarchy());

    act(() => {
      result.current.buildHierarchy(employees, 'C');
    });

    expect(result.current.hierarchy).toBe(
      'Unable to process employee tree. C has multiple managers: B, A',
    );
  });

  it('should handle an employee with no hierarchy', () => {
    const employees = [{ id: 1, name: 'A', managerId: null, children: [] }];

    const { result } = renderHook(() => useHierarchy());

    act(() => {
      result.current.buildHierarchy(employees, 'A');
    });

    expect(result.current.hierarchy).toBe(
      'Unable to process employeee hierarchy. A not having hierarchy',
    );
  });
});
