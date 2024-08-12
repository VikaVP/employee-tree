'use client';

import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import { Toast } from 'primereact/toast';
import React, { useCallback, useRef, useState } from 'react';

import { EmployeeService } from '@/services/EmployeeService';

import Modal from './ModalEmployee';

export default function ActionDropdown() {
  const menu = useRef(null);
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

  const toast = useRef(null);

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

  return (
    <>
      <div className="card flex">
        <TieredMenu
          model={items}
          popup
          ref={menu}
          breakpoint="767px"
          style={{
            fontSize: '12px',
          }}
        />
        <Button
          label="Action"
          onClick={(e) => menu?.current && (menu.current as any).toggle(e)}
        />
      </div>
      <Modal
        data={{
          open: openModal,
          setOpen: setOpenModal,
          type: modal,
          title: `${modal === 'new' ? 'Add New Employee' : modal === 'edit' ? 'Edit Employee' : 'Delete Employee'}`,
          click: handleClick,
        }}
      />
      <Toast ref={toast} />
    </>
  );
}
