import { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  showKeyboardHint?: boolean;
  onSend?: () => void;
}

export interface InputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
}

export const Input = forwardRef<InputRef, InputProps>(
  ({ 
    showKeyboardHint = true, 
    onSend,
    onChange,
    onKeyDown,
    className = '',
    ...props 
  }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [characterCount, setCharacterCount] = useState(0);

    // Auto-resize textarea
    useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Reset height to calculate scrollHeight
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = parseInt(getComputedStyle(textarea).maxHeight) || 200;
      
      // Set height but cap at maxHeight
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }, [props.value]);

    // Handle character count
    useEffect(() => {
      const value = typeof props.value === 'string' ? props.value : '';
      setCharacterCount(value.length);
    }, [props.value]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
      blur: () => textareaRef.current?.blur(),
      clear: () => {
        if (textareaRef.current) {
          textareaRef.current.value = '';
          textareaRef.current.style.height = 'auto';
          setCharacterCount(0);
        }
      },
    }));

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Ctrl/Cmd + Enter to send
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onSend?.();
        return;
      }

      // Regular Enter key handling
      onKeyDown?.(e);
    };

    return (
      <div className={styles.container}>
        <textarea
          ref={textareaRef}
          className={`${styles.input} ${className}`}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label="Message input"
          aria-describedby={showKeyboardHint ? 'keyboard-hint' : undefined}
          {...props}
        />
        {showKeyboardHint && (
          <div 
            id="keyboard-hint" 
            className={styles.hint}
            aria-live="polite"
          >
            <span className={styles.hintText}>Ctrl+Enter to send</span>
            {characterCount > 0 && (
              <span className={styles.characterCount}>{characterCount}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;


