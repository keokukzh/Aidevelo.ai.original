import React from 'react';

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function NavLink({ href, children, onClick }: NavLinkProps): JSX.Element {
  return (
    <a href={href} onClick={onClick} style={{
      color: 'var(--color-text)',
      padding: '0.4rem 0.6rem',
      borderRadius: 8,
      textDecoration: 'none'
    }}>
      {children}
    </a>
  );
}

export default NavLink;



