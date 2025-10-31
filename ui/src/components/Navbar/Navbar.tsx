import { lazy, Suspense, useId, useState } from 'react';
import styles from './Navbar.module.css';
import { HamburgerButton } from '../HamburgerButton/HamburgerButton';
import { NavLink } from '../NavLink/NavLink';

const Drawer = lazy(() => import('../Drawer/Drawer'));

export interface NavbarProps {
  links?: { label: string; href: string }[];
}

export function Navbar({ links = defaultLinks }: NavbarProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const labelledById = useId();

  const navLinks = (
    <>
      {links.map(link => (
        <li key={link.href}><NavLink href={link.href} onClick={() => setOpen(false)}>{link.label}</NavLink></li>
      ))}
    </>
  );

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <img className={styles.logo} src="/assets/images/logo.png" alt="AIDEVELO.AI" />
          <h1 className={styles.title}>AIDEVELO.AI</h1>
        </div>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>{navLinks}</ul>
        </nav>

        <div className={styles.spacer} />

        <HamburgerButton
          open={open}
          className={styles.menuBtn}
          aria-controls="mobile-drawer"
          aria-label="Open menu"
          onClick={() => setOpen(o => !o)}
        />
      </div>

      <Suspense fallback={null}>
        <Drawer open={open} onClose={() => setOpen(false)} labelledById={labelledById} title="Menu">
          {navLinks}
        </Drawer>
      </Suspense>
    </header>
  );
}

const defaultLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Docs', href: '#docs' },
  { label: 'Contact', href: '#contact' },
];

export default Navbar;



