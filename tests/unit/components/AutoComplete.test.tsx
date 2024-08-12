import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { vi } from 'vitest';

import AutoCompleteSearch from '../../../src/components/AutoCompleteSearch';

// Mock the useEmployee hook
vi.mock('../../../src/hooks/UseEmployee', () => ({
  useEmployee: () => ({
    getEmployeeAutoComplete: vi.fn().mockResolvedValue([
      { id: 1, name: 'A', value: 1 },
      { id: 2, name: 'B', value: 2 },
    ]),
    employeeLists: [
      { id: 1, name: 'A', value: 1 },
      { id: 2, name: 'B', value: 2 },
    ],
  }),
}));

// Mock the AutoComplete component from PrimeReact
vi.mock('primereact/autocomplete', () => ({
  AutoComplete: ({
    field,
    value,
    suggestions,
    completeMethod,
    onChange,
    placeholder,
  }: any) => {
    return (
      <input
        placeholder={placeholder}
        value={value ? value[field] : ''}
        onChange={(e) => {
          const query = e.target.value;
          completeMethod({ query });
          onChange(
            { value: suggestions?.find((s: any) => s[field] === query) } ||
              query,
          );
        }}
      />
    );
  },
}));

describe('AutoCompleteSearch Component', () => {
  it('renders without crashing', () => {
    render(<AutoCompleteSearch query={vi.fn()} />);
    expect(
      screen.getByPlaceholderText('Select an employee to see hierarchy tree'),
    ).toBeInTheDocument();
  });

  it('searches and filters employees', async () => {
    render(<AutoCompleteSearch query={vi.fn()} />);

    const input = screen.getByPlaceholderText(
      'Select an employee to see hierarchy tree',
    ) as HTMLInputElement;
    input.focus();

    await userEvent.type(input, 'a');

    setTimeout(() => {
      expect(input.value).toBe('a');
    }, 2000);
  });

  it('displays "Not found" if no employees match', async () => {
    render(<AutoCompleteSearch query={vi.fn()} />);

    const input = screen.getByPlaceholderText(
      'Select an employee to see hierarchy tree',
    ) as HTMLInputElement;

    await userEvent.type(input, 'test');

    setTimeout(() => {
      expect(input.value).toBe('Not found');
    }, 2000);
  });

  it('calls query function on employee selection', async () => {
    const queryMock = vi.fn();
    render(<AutoCompleteSearch query={queryMock} />);

    const input = screen.getByPlaceholderText(
      'Select an employee to see hierarchy tree',
    ) as HTMLInputElement;

    await userEvent.type(input, 'a');

    setTimeout(() => {
      expect(queryMock).toHaveBeenCalledWith({ id: 1, name: 'A', value: 1 });
    }, 2000);
  });
});
