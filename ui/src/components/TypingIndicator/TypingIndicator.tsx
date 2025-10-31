import styles from './TypingIndicator.module.css';

export interface TypingIndicatorProps {
  label?: string;
}

export function TypingIndicator({ label = 'AI is typing' }: TypingIndicatorProps): JSX.Element {
  return (
    <div 
      className={styles.container}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className={styles.dots}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default TypingIndicator;


