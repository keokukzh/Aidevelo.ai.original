import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './ChatLayout.module.css';
import { MessageGroup } from '../MessageGroup/MessageGroup';
import { TypingIndicator } from '../TypingIndicator/TypingIndicator';
import { Input, InputRef } from '../Input/Input';
import { Button } from '../Button/Button';
import { groupMessages, MessageWithTimestamp } from '../../utils/messageGrouping';
import { apiBuild, apiGetRun, RunInfo } from '../../utils/api';

export function ChatLayout(): JSX.Element {
  const [messages, setMessages] = useState<MessageWithTimestamp[]>(() => [
    { 
      id: 'w1', 
      role: 'assistant', 
      content: "Welcome to AIDEVELO.AI! I can help you build, debug, and deploy.",
      timestamp: new Date()
    },
  ]);
  const [value, setValue] = useState('');
  const [typing, setTyping] = useState(false);
  const [runStatus, setRunStatus] = useState<string>('Ready');
  const pollRef = useRef<number | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<InputRef | null>(null);
  const announcementRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const el = scrollRef.current; if (!el) return; el.scrollTop = el.scrollHeight;
  }, [messages.length, typing]);

  // Announce new messages to screen readers
  useEffect(() => {
    if (announcementRef.current && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      announcementRef.current.textContent = `New ${lastMessage.role} message: ${lastMessage.content.substring(0, 50)}`;
    }
  }, [messages]);

  // Clear polling on unmount
  useEffect(() => () => { if (pollRef.current) window.clearInterval(pollRef.current); }, []);

  const canSend = value.trim().length > 0 && !typing;
  const groupedMessages = useMemo(() => groupMessages(messages), [messages]);

  async function handleSend(): Promise<void> {
    if (!canSend) return;
    const text = value.trim();
    setValue('');
    inputRef.current?.clear();

    const id = crypto.randomUUID?.() ?? String(Date.now());
    const timestamp = new Date();

    // Add user message
    setMessages(prev => [...prev, { id, role: 'user', content: text, timestamp }]);
    setTyping(true);
    setRunStatus('Submitting…');

    try {
      // Kick off backend run
      const build = await apiBuild(text);
      setRunStatus('QUEUED');

      // Start polling
      if (pollRef.current) window.clearInterval(pollRef.current);
      pollRef.current = window.setInterval(async () => {
        try {
          const info: RunInfo = await apiGetRun(build.run_id);
          setRunStatus(info.status);

          // Stream logs as assistant messages snapshot (last message difference)
          if (info.logs && info.logs.length > 0) {
            const content = info.logs.join('\n');
            const msgId = `logs-${build.run_id}`;
            setMessages(prev => {
              const exists = prev.find(m => m.id === msgId);
              const newMsg: MessageWithTimestamp = {
                id: msgId,
                role: 'assistant',
                content,
                timestamp: new Date()
              };
              if (exists) {
                return prev.map(m => (m.id === msgId ? newMsg : m));
              }
              return [...prev, newMsg];
            });
          }

          if (info.status === 'COMPLETED' || info.status === 'FAILED' || info.status === 'CANCELED') {
            if (pollRef.current) { window.clearInterval(pollRef.current); pollRef.current = null; }
            setTyping(false);
          }
        } catch (e) {
          // Stop polling on hard error
          if (pollRef.current) { window.clearInterval(pollRef.current); pollRef.current = null; }
          setTyping(false);
          setRunStatus('Error');
          setMessages(prev => [...prev, { id: `err-${Date.now()}`, role: 'assistant', content: (e as Error).message, timestamp: new Date() }]);
        }
      }, 1000);
    } catch (e) {
      setTyping(false);
      setRunStatus('Error');
      setMessages(prev => [...prev, { id: `err-${Date.now()}`, role: 'assistant', content: (e as Error).message, timestamp: new Date() }]);
    }
  }

  return (
    <div className={styles.root}>
      {/* Screen reader announcements */}
      <div ref={announcementRef} className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true" />

      <div className={styles.header}>
        <div className={styles.brand}>
          <img src="/assets/images/logo.png" width={24} height={24} alt="AIDEVELO.AI" />
          <h1 className={styles.brandTitle}>AIDEVELO.AI</h1>
        </div>
        <div className={styles.status} aria-live="polite">
          Status: {runStatus}
        </div>
      </div>

      <div className={styles.main} id="main-content">
        <aside className={styles.sidebar} aria-label="Chat sidebar">
          <div className={styles.sidebarContent}>
            <h2 className={styles.sidebarTitle}>Quick Actions</h2>
            <nav aria-label="Shortcuts">
              <ul className={styles.sidebarList}>
                <li>Sidebar content coming soon</li>
              </ul>
            </nav>
          </div>
        </aside>

        <section className={styles.messages} aria-label="Chat messages">
          <div ref={scrollRef} className={styles.scroll}>
            <div className={styles.welcome}>
              <strong className={styles.welcomeTitle}>Welcome to AIDEVELO.AI! 🚀</strong>
              <div className={styles.welcomeText}>
                Type your request below and press Ctrl+Enter to send.
              </div>
            </div>

            {groupedMessages.map((group, index) => (
              <MessageGroup key={`group-${index}`} group={group} />
            ))}

            {typing && <TypingIndicator />}
          </div>

          <footer className={styles.footer}>
            <div className={styles.inputRow}>
              <Input
                ref={inputRef}
                placeholder="Describe what you want to build…"
                value={value}
                onChange={e => setValue(e.target.value)}
                onSend={handleSend}
                showKeyboardHint={true}
                disabled={typing}
                aria-label="Message input"
              />
              <Button onClick={handleSend} disabled={!canSend} variant="primary" size="md" aria-label="Send message">Send</Button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}

export default ChatLayout;



