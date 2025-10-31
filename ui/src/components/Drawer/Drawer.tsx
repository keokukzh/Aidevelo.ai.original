import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import styles from './Drawer.module.css';

export interface DrawerProps {
  open: boolean;
  title?: string;
  labelledById?: string;
  onClose: () => void;
  children: React.ReactNode;
}

function getFocusable(root: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]', 'area[href]', 'button:not([disabled])', 'input:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'
  ].join(',');
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
}

export function Drawer({ open, onClose, title = 'Menu', labelledById, children }: DrawerProps): JSX.Element | null {
  const panelRef = useRef<HTMLElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  // Lock body scroll
  useLayoutEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  // Restore focus to trigger element
  useEffect(() => {
    if (open) {
      lastFocusedElementRef.current = document.activeElement as HTMLElement | null;
      // focus first focusable in panel
      setTimeout(() => {
        const root = panelRef.current;
        if (!root) return;
        const focusables = getFocusable(root);
        (focusables[0] ?? root).focus();
      }, 0);
    } else if (lastFocusedElementRef.current) {
      lastFocusedElementRef.current.focus();
    }
  }, [open]);

  // Trap focus within drawer
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const root = panelRef.current;
    if (!root) return;
    const focusables = getFocusable(root);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const current = document.activeElement as HTMLElement | null;
    if (e.shiftKey && current === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && current === last) {
      e.preventDefault(); first.focus();
    }
  }, [onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} aria-hidden={false} onClick={onClose}>
      <aside
        className={`${styles.panel} ${styles.open}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        onKeyDown={onKeyDown}
        ref={panelRef as React.RefObject<HTMLElement>}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id={labelledById} style={{ margin: 0, fontSize: '1rem' }}>{title}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close menu">Close</button>
        </div>
        <nav className={styles.nav} aria-label="Mobile">
          <ul className={styles.list}>
            {children}
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export default Drawer;



