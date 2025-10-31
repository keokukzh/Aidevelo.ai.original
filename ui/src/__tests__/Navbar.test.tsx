import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { Navbar } from '../components/Navbar/Navbar';

afterEach(cleanup);

describe('Navbar', () => {
  it('renders the hamburger control', () => {
    render(<Navbar />);
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });

  it('opens and closes the drawer with the hamburger button', async () => {
    render(<Navbar />);
    const button = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(button);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // close via escape
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('restores focus to hamburger after closing', () => {
    render(<Navbar />);
    const button = screen.getByRole('button', { name: /open menu/i });
    button.focus();
    fireEvent.click(button);
    const dialog = screen.getByRole('dialog');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(button).toHaveFocus();
  });

  it('links are reachable by keyboard in drawer', () => {
    render(<Navbar />);
    const button = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(button);
    const dialog = screen.getByRole('dialog');
    const list = within(dialog).getByRole('navigation', { name: /mobile/i });
    const links = within(list).getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});


