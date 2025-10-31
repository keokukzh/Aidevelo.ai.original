import { useId } from 'react';
import styles from './Message.module.css';
import { formatTimeFull } from '../../utils/formatTime';

export interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  showTimestamp?: boolean;
  isGrouped?: boolean;
}

export function Message({ 
  role, 
  content, 
  timestamp, 
  showTimestamp = true,
  isGrouped = false 
}: MessageProps): JSX.Element {
  const messageId = useId();
  const displayTimestamp = timestamp ? formatTimeFull(timestamp) : null;

  return (
    <div 
      className={`${styles.message} ${styles[role]} ${isGrouped ? styles.grouped : ''}`}
      role="article"
      aria-labelledby={messageId}
    >
      <div className={styles.content} id={messageId}>
        {content}
      </div>
      {showTimestamp && displayTimestamp && (
        <div className={styles.timestamp} aria-label={`Sent at ${displayTimestamp}`}>
          {displayTimestamp}
        </div>
      )}
    </div>
  );
}

export default Message;


