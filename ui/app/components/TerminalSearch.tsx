"use client";
import React, { useCallback, useState } from 'react';

export type TerminalSearchProps = {
  placeholder?: string;
  onSubmit?: (value: string) => void;
};

export default function TerminalSearch({ placeholder = "search...", onSubmit }: TerminalSearchProps) {
  const [value, setValue] = useState("");

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSubmit?.(value.trim());
      }
    },
    [onSubmit, value]
  );

  return (
    <div className="terminal-search-container">
      <div className="terminal-search-wrapper">
        <span className="terminal-prompt" aria-hidden>
          &gt;
        </span>
        <input
          aria-label="Terminal search input"
          type="text"
          className="terminal-search-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="terminal-btn"
          aria-label="Run command"
          onClick={() => onSubmit?.(value.trim())}
        >
          run
        </button>
      </div>
    </div>
  );
}
