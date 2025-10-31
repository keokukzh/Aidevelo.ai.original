import styles from './MessageGroup.module.css';
import { Message } from '../Message/Message';
import { GroupedMessage } from '../../utils/messageGrouping';

export interface MessageGroupProps {
  group: GroupedMessage;
  showTimestamp?: boolean;
}

export function MessageGroup({ group, showTimestamp = true }: MessageGroupProps): JSX.Element {
  return (
    <div 
      className={styles.group}
      role="group"
      aria-label={`${group.role} message group`}
    >
      {group.messages.map((message, index) => (
        <Message
          key={message.id}
          role={message.role}
          content={message.content}
          timestamp={message.timestamp}
          showTimestamp={showTimestamp && index === group.messages.length - 1}
          isGrouped={index > 0}
        />
      ))}
    </div>
  );
}

export default MessageGroup;


