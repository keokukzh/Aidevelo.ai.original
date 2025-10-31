import styles from './LoadingState.module.css';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 'md' 
}: LoadingStateProps): JSX.Element {
  return (
    <div 
      className={`${styles.container} ${styles[size]}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className={styles.spinner} aria-hidden="true">
        <div className={styles.spinnerRing} />
        <div className={styles.spinnerRing} />
        <div className={styles.spinnerRing} />
      </div>
      {message && <span className={styles.message}>{message}</span>}
    </div>
  );
}

export default LoadingState;


