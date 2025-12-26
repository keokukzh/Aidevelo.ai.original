"use client";
import React, { useCallback, useState } from 'react';

export type CommandLineProps = {
  command: string;
};

export default function CommandLine({ command }: CommandLineProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }, [command]);

  return (
    <div className="command-line" aria-live="polite">
      <span className="prompt" aria-hidden>$</span>
      <code className="command">{command}</code>
      <button type="button" className="copy-btn" onClick={copy} aria-label="Copy command">
        {copied ? 'copied' : 'copy'}
      </button>
    </div>
  );
}
