import { act, renderHook } from '@testing-library/react';

import { useColorRandom } from '../../../src/hooks/UseColorRandom';

describe('UseColorRandom', () => {
  describe('Render hook', () => {
    it("shouldn't not have color by default", async () => {
      const { result } = renderHook(() => useColorRandom());

      expect(result.current.color).toBe('');
    });

    it('should get color', () => {
      const { result } = renderHook(() => useColorRandom());

      act(() => {
        result.current.getRandomColor();
      });

      expect(result.current.color).toBeTruthy();
    });
  });
});
