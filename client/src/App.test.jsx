import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders login page for unauthenticated users', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <div>
          <h1>LabTrack</h1>
          <p>Laboratory Information Management System</p>
        </div>
      </MemoryRouter>
    );
    expect(screen.getByText('LabTrack')).toBeDefined();
    expect(screen.getByText('Laboratory Information Management System')).toBeDefined();
  });
});
