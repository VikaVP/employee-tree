import { useState } from 'react';

/**
 * React Hook to count direct and indirect reports.
 * @hook
 */

export const useCountDirectIndirectReports = () => {
  const [count, setCount] = useState<CountReports>({
    direct: 0,
    indirect: 0,
  });
  const countIndirectReports = (
    reports: TreeNode[],
    data: TreeNode[],
    indirect: number,
  ) => {
    if (reports.length < 1) {
      return indirect;
    }
    let count = indirect;
    reports.map((report) => {
      const direct = data.filter((dt) => dt.managerId === report.id);
      count += direct.length;
      if (direct.length > 0) {
        const countIndirect = countIndirectReports(direct, data, 0);
        count += countIndirect;
      }
    });
    return count;
  };

  const countDirectIndirectReports = (data: TreeNode[], search: string) => {
    const searchData: TreeNode | null =
      data.filter(
        (dt) => dt.name.toLowerCase() === search.toLowerCase(),
      )?.[0] || null;
    if (searchData) {
      const direct = data.filter((dt) => dt.managerId === searchData.id);
      const count = {
        direct: direct.length,
        indirect: 0,
      };
      if (direct.length > 0) {
        const countIndirect = countIndirectReports(
          direct,
          data,
          count.indirect,
        );
        count.indirect = countIndirect;
      }
      setCount(count);
    }
  };

  return { count, countDirectIndirectReports };
};
