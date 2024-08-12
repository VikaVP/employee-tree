import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import OrgChart from '../../../src/components/OrgChart';

// Mock scrollIntoView globally
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mocking the hooks
vi.mock('../../../src/hooks/UseHierarchy', () => ({
  useHierarchy: () => ({
    hierarchy: null, // hierarchy not yet available
    buildHierarchy: vi.fn(),
  }),
}));

describe('OrgChart Null', () => {
  it('displays loading message when hierarchy is not yet available', () => {
    render(
      <OrgChart query={{ id: 1, name: 'A', managerId: null, children: [] }} />,
    );

    expect(screen.getByText(/null/i)).toBeInTheDocument(); // displays the loading message
  });
});
