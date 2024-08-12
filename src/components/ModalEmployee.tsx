'use client';

import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import Select from 'react-tailwindcss-select';

import { useEmployee } from '@/hooks/UseEmployee';

import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

export default function Modal({
  data: { open, setOpen, type, title, click },
}: {
  data: {
    open: boolean;
    setOpen: (open: boolean) => void;
    type: string;
    title?: string;
    click?: (data?: any) => void;
  };
}) {
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeOptions | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<
    EmployeeOptions[] | null
  >(null);
  const [name, setName] = useState('');
  const [selectedManager, setSelectedManager] =
    useState<EmployeeOptions | null>(null);
  const { getEmployeeOptions, employeeOptions } = useEmployee();

  useEffect(() => {
    const getEmployee = async () => {
      await getEmployeeOptions();
    };
    const timer = setTimeout(() => {
      setName('');
      setSelectedManager(null);
      setSelectedEmployee(null);
      setSelectedEmployees(null);
      getEmployee();
    }, 10);

    return () => clearTimeout(timer);
  }, [open]);

  const handleSubmit = () => {
    const data =
      type === 'new'
        ? {
            name,
            managerId: selectedManager?.value,
          }
        : type === 'edit'
          ? {
              name: selectedEmployee?.label,
              id: selectedEmployee?.value,
              managerId: selectedManager?.value,
            }
          : selectedEmployees?.map((dt) => {
              return +dt.value;
            });
    click && click(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="mb-2">{title}</DialogTitle>
        </DialogHeader>
        {type === 'new' ? (
          <>
            <div className="flex-column flex w-full gap-2 ">
              <label htmlFor="name">Employee Name</label>
              <InputText
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-describedby="name-help"
                className="w-full"
                placeholder="Entry employee name"
              />
            </div>
            <div className="flex-column flex w-full gap-2 ">
              <label htmlFor="manager">Manager</label>
              <Select
                onChange={(value: any) => setSelectedManager(value)}
                options={employeeOptions}
                value={selectedManager}
                primaryColor=""
                placeholder="Select a manager"
              />
            </div>
          </>
        ) : type === 'edit' ? (
          <>
            <div className="flex-column flex w-full gap-2">
              <label htmlFor="name">Employee Name</label>
              <Select
                onChange={(value: any) => setSelectedEmployee(value)}
                options={employeeOptions}
                value={selectedEmployee}
                primaryColor=""
                placeholder="Select employee name"
              />
            </div>
            <div className="flex-column flex w-full gap-2 ">
              <label htmlFor="manager">Manager</label>
              <Select
                onChange={(value: any) => setSelectedManager(value)}
                options={employeeOptions}
                value={selectedManager}
                primaryColor=""
                placeholder="Select a manager"
              />
            </div>
          </>
        ) : (
          <div className="flex-column flex w-full gap-2 ">
            <label htmlFor="name">Employee Name</label>
            <Select
              onChange={(value: any) => setSelectedEmployees(value)}
              options={employeeOptions}
              value={selectedEmployees}
              primaryColor=""
              isMultiple
              placeholder="Select employee"
            />
          </div>
        )}
        <DialogFooter className="flex-row gap-2 sm:justify-center">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="button"
              className="bg-black dark:bg-slate-400"
              onClick={handleSubmit}
              disabled={
                type === 'new'
                  ? !name
                  : type === 'edit'
                    ? !selectedEmployee
                    : !selectedEmployees?.length
              }
            >
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
