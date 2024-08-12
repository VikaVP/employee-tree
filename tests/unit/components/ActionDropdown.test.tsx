import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { forwardRef } from 'react';
import { vi } from 'vitest';

import ActionDropdown from '../../../src/components/ActionDropdown';
import { EmployeeService } from '../../../src/services/EmployeeService';

// Mocking EmployeeService
vi.mock('../../../src/services/EmployeeService', () => ({
  EmployeeService: {
    addEmployee: vi.fn().mockResolvedValue('Success'),
    updateEmployee: vi.fn().mockResolvedValue('Success'),
    deleteEmployees: vi.fn().mockResolvedValue('Success'),
    getEmployees: vi.fn(),
  },
}));

// Mocking PrimeReact components
const buttonHoisted = vi.hoisted(() => ({
  Button: ({ label, onClick }: { label: string; onClick: any }) => (
    <button onClick={onClick}>{label}</button>
  ),
}));
vi.mock('primereact/button', () => {
  return { Button: buttonHoisted.Button };
});

vi.mock('primereact/tieredmenu', () => ({
  TieredMenu: forwardRef((props: any, ref) => {
    return (
      <div ref={ref as any}>
        {props.model.map((item: any, idx: number) => (
          <button key={idx} onClick={item.command}>
            {item.label}
          </button>
        ))}
      </div>
    );
  }),
}));

vi.mock('primereact/toast', () => ({
  Toast: forwardRef((_props, ref) => {
    React.useImperativeHandle(ref, () => ({
      show: vi.fn(),
    }));
    return <div data-testid="mock-toast">Mock Toast</div>;
  }),
}));

// Mocking Modal component
vi.mock('../../../src/components/ModalEmployee', () => ({
  default: ({ data }: any) =>
    data.open && (
      <div>
        <h1>{data.title}</h1>
        <button onClick={() => data.click({ name: 'Test Employee' })}>
          Submit
        </button>
      </div>
    ),
}));

describe('ActionDropdown', () => {
  it('renders without crashing', () => {
    render(<ActionDropdown />);
    const action = screen.getByText('Action');
    expect(action).toBeInTheDocument();
  });

  it('opens the modal with correct title when "New Employee" is clicked', async () => {
    render(<ActionDropdown />);
    const addEmployee = screen.getByText('New Employee');
    fireEvent.click(addEmployee);

    await waitFor(() => {
      expect(
        screen.getByText('Add New Employee', {
          selector: 'h1',
        }),
      ).toBeInTheDocument();
    });
  });

  it('opens the modal with correct title when "Edit Employee" is clicked', async () => {
    render(<ActionDropdown />);

    const editEmployee = screen.getByText('Edit Employee');
    await userEvent.click(editEmployee);

    await waitFor(() => {
      expect(
        screen.getByText('Edit Employee', {
          selector: 'h1',
        }),
      ).toBeInTheDocument();
    });
  });

  it('opens the modal with correct title when "Delete Employee" is clicked', async () => {
    render(<ActionDropdown />);

    const deleteEmployee = screen.getByText('Delete Employee');
    await userEvent.click(deleteEmployee);

    await waitFor(() => {
      expect(
        screen.getByText('Delete Employee', {
          selector: 'h1',
        }),
      ).toBeInTheDocument();
    });
  });

  it('calls the correct service method when submit on modal action', async () => {
    render(<ActionDropdown />);
    const addEmployee = screen.getByText('New Employee');
    await userEvent.click(addEmployee);

    await screen.findByText('Add New Employee');

    await userEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(EmployeeService.addEmployee).toHaveBeenCalledWith({
        name: 'Test Employee',
      });
    });

    const editEmployee = screen.getByText('Edit Employee');
    await userEvent.click(editEmployee);
    await screen.findByText('Edit Employee', {
      selector: 'h1',
    });

    await userEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(EmployeeService.updateEmployee).toHaveBeenCalledWith({
        name: 'Test Employee',
      });
    });

    const deleteEmployee = screen.getByText('Delete Employee');
    await userEvent.click(deleteEmployee);
    await screen.findByText('Delete Employee', {
      selector: 'h1',
    });

    await userEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(EmployeeService.deleteEmployees).toHaveBeenCalledWith({
        name: 'Test Employee',
      });
    });
  });
});
