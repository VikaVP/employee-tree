import { render, screen, waitFor } from '@testing-library/react';
import React, { forwardRef } from 'react';
import { vi } from 'vitest';

import OrgChart from '../../../src/components/OrgChart';

// Mock scrollIntoView globally
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mocking the hooks
vi.mock('../../../src/hooks/UseHierarchy', () => ({
  useHierarchy: () => ({
    hierarchy: { id: 1, name: 'A' },
    buildHierarchy: vi.fn(),
  }),
}));

vi.mock('../../../src/hooks/UseCountDirectIndirectReports', () => ({
  useCountDirectIndirectReports: () => ({
    countDirectIndirectReports: vi.fn(),
    count: { direct: 2, indirect: 4 },
  }),
}));

vi.mock('../../../src/hooks/UseEmployee', () => ({
  useEmployee: () => ({
    getDatas: vi.fn().mockResolvedValue([{ id: 1, name: 'A' }]),
  }),
}));

// Mocking the Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: () => <img alt="Mocked Image" />,
}));

// Mocking the OrganizationChart component
const buttonHoisted = vi.hoisted(() => ({
  OrganizationChart: ({ value }: { value: any }) => (
    <div data-testid="mocked-org-chart">{JSON.stringify(value)}</div>
  ),
}));
vi.mock('primereact/organizationchart', () => ({
  OrganizationChart: buttonHoisted.OrganizationChart,
}));

// Mocking the ScrollPanel component
vi.mock('primereact/scrollpanel', () => ({
  ScrollPanel: forwardRef((props: any, ref) => (
    <div>
      {props.children} <div ref={ref as any} />
    </div>
  )),
}));

describe('OrgChart', () => {
  it('renders hierarchy correctly when query is provided', async () => {
    const query = { id: 1, name: 'A', managerId: null, children: [] };

    render(<OrgChart query={query} />);

    // Wait for the async actions to complete
    await waitFor(() => {
      expect(screen.getByTestId('mocked-org-chart')).toBeInTheDocument();
      expect(screen.getByText(/Total of Direct Reports/i)).toBeInTheDocument();
      // check direct reports
      expect(screen.getByText(/2/i)).toBeInTheDocument();
      // check indirect reports
      expect(screen.getByText(/4/i)).toBeInTheDocument();
    });
  });

  it('displays message when no query is provided', () => {
    render(<OrgChart query={null} />);

    expect(
      screen.getByText(/Please choose employee to render Hierarchy/i),
    ).toBeInTheDocument();
  });
});
