import styles from './HamburgerButton.module.css';
import type { ButtonHTMLAttributes } from 'react';

export interface HamburgerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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



