import { act, renderHook } from '@testing-library/react';

import { useCountDirectIndirectReports } from '../../../src/hooks/UseCountDirectIndirectReports';

describe('UseCountDirectIndirectReports', () => {
  describe('Render hook', () => {
    it("shouldn't not count by default", async () => {
      const { result } = renderHook(() => useCountDirectIndirectReports());

      expect(result.current.count.direct).toBe(0);
      expect(result.current.count.indirect).toBe(0);
    });

    it('should count direct/indirect reports', () => {
      const { result } = renderHook(() => useCountDirectIndirectReports());

      act(() => {
        result.current.countDirectIndirectReports(
          [
            { id: 1, name: 'A', managerId: null, children: [] },
            { id: 2, name: 'B', managerId: 1, children: [] },
          ],
          'A',
        );
      });

      expect(result.current.count.direct).toBe(1);
      expect(result.current.count.indirect).toBe(0);
    });
  });
});
