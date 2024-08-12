interface TreeNode {
  id: number;
  name: string;
  managerId: number | null;
  children: TreeNode[];
  expanded?: boolean;
}

interface CountReports {
  direct: number;
  indirect: number;
}

interface Employees {
  id?: number;
  name: string;
  value?: number;
  disabled?: boolean;
}

interface EmployeeOptions {
  label: string;
  value: string;
}

interface EmployeeField {
  id?: number;
  name: string;
  managerId: number | null;
}
