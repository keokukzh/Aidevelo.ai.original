/**
 * Message grouping utility - groups consecutive messages from the same sender
 */
export type MessageWithTimestamp = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
};

export type GroupedMessage = {
  role: 'user' | 'assistant';
  messages: MessageWithTimestamp[];
  timestamp: Date;
};

export function groupMessages(messages: MessageWithTimestamp[]): GroupedMessage[] {
  if (messages.length === 0) return [];

  const groups: GroupedMessage[] = [];
  let currentGroup: GroupedMessage | null = null;

  for (const message of messages) {
    const timestamp = message.timestamp || new Date();
    
    // Start new group if:
    // 1. No current group
    // 2. Different role than current group
    // 3. More than 5 minutes gap from last message
    const shouldStartNewGroup = 
      !currentGroup ||
      currentGroup.role !== message.role ||
      (currentGroup.timestamp && 
       timestamp.getTime() - currentGroup.timestamp.getTime() > 5 * 60 * 1000);

    if (shouldStartNewGroup) {
      currentGroup = {
        role: message.role,
        messages: [message],
        timestamp: timestamp,
      };
      groups.push(currentGroup);
    } else if (currentGroup) {
      // Add to current group
      currentGroup.messages.push(message);
      // Update timestamp to most recent message in group
      currentGroup.timestamp = timestamp;
    }
  }

  return groups;
}

