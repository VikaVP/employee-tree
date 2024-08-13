'use client';

import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import { Toast } from 'primereact/toast';
import React, { useRef } from 'react';

import { useActionDropdown } from '../hooks/UseActionDropdown';
import Modal from './ModalEmployee';

export default function ActionDropdown() {
  const menu = useRef(null);
  const { modal, openModal, items, toast, handleClick, setOpenModal } =
    useActionDropdown();

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
