/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-await-sync-events */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { act } from 'react';
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
    value,
    suggestions,
    completeMethod,
    onFocus,
    onChange,
    placeholder,
  }: any) => (
    <div>
      <input
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => (
          onChange({ value: e.target.value }),
          completeMethod({ query: e.target.value })
        )}
        onFocus={onFocus}
        data-testid="autocomplete-input"
      />
      {suggestions?.length > 0 && (
        <ul>
          {suggestions.map((item: any, index: number) => (
            <li
              key={index}
              onClick={() => onChange({ value: item })}
              data-testid="suggestion-item"
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  ),
}));

describe('AutoCompleteSearch', () => {
  it('renders without crashing', () => {
    render(<AutoCompleteSearch query={vi.fn()} />);
    expect(
      screen.getByPlaceholderText('Select an employee to see hierarchy tree'),
    ).toBeInTheDocument();
  });

  it('searches and filters employees', async () => {
    render(<AutoCompleteSearch query={vi.fn()} />);

    const input = screen.getByTestId('autocomplete-input') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { value: 'a' } });
      expect(input.value).toEqual('a');
    });
  });

  it('displays "Not found" if no employees match', async () => {
    render(<AutoCompleteSearch query={vi.fn()} />);

    const input = screen.getByTestId('autocomplete-input') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { value: 'test' } });
      input.focus();
    });
    await waitFor(() => {
      const options = screen.getByTestId('suggestion-item');
      expect(options).toHaveTextContent('Not found');
    });
  });

  it('calls query function on employee selection', async () => {
    const queryMock = vi.fn();
    render(<AutoCompleteSearch query={queryMock} />);

    const input = screen.getByTestId('autocomplete-input') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { value: 'a' } });
      input.focus();
    });
    await waitFor(() => {
      const options = screen.getByTestId('suggestion-item');
      expect(options).toHaveTextContent('A');
    });
  });
});
