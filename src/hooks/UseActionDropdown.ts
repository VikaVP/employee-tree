import { useCallback, useRef, useState } from 'react';

import { EmployeeService } from '../services/EmployeeService';
/**
 * React Hook to Action Dropdown.
 * @hook
 */
export const useActionDropdown = () => {
  const toast = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [modal, setModal] = useState('');
  const items = [
    {
      label: 'New Employee',
      icon: 'pi pi-plus',
      command: () => {
        setModal('new');
        setOpenModal(true);
      },
    },
    {
      label: 'Edit Employee',
      icon: 'pi pi-file-edit',
      command: () => {
        setModal('edit');
        setOpenModal(true);
      },
    },
    {
      label: 'Delete Employee',
      icon: 'pi pi-times',
      command: () => {
        setModal('delete');
        setOpenModal(true);
      },
    },
  ];

  const show = (type: string, message: string) => {
    (toast.current as any)?.show({ severity: type, detail: message });
  };
  const handleClick = useCallback(
    (datas: any) => {
      (modal === 'new'
        ? EmployeeService.addEmployee(datas)
        : modal === 'edit'
          ? EmployeeService.updateEmployee(datas)
          : EmployeeService.deleteEmployees(datas)
      ).then((res) =>
        typeof res !== 'string'
          ? (show(
              'success',
              modal === 'new'
                ? 'Success add employee'
                : modal === 'edit'
                  ? 'Success edit employee'
                  : 'Success delete employees',
            ),
            EmployeeService.getEmployees())
          : show('error', res),
      );
    },
    [modal],
  );

  return {
    modal,
    openModal,
    items,
    toast,
    handleClick,
    setOpenModal,
    setModal,
  };
};
