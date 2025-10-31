import React from 'react';
import styles from './HamburgerButton.module.css';

export interface HamburgerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  open: boolean;
}

export function HamburgerButton({ open, ...props }: HamburgerButtonProps): JSX.Element {
  return (
    <button
      type="button"
      aria-label="Open main menu"
      aria-expanded={open}
      className={styles.root + (open ? ' ' + styles.open : '')}
      {...props}
    >
      <span className={`${styles.bar} ${styles.bar1}`} />
      <span className={`${styles.bar} ${styles.bar2}`} />
      <span className={`${styles.bar} ${styles.bar3}`} />
    </button>
  );
}

export default HamburgerButton;



