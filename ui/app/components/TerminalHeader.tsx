import React from 'react';

export type TerminalHeaderProps = {
  title: string;
  subtitle?: string;
  asciiArt?: string;
  statusColor?: 'success' | 'warning' | 'error';
};

const colorVarByStatus: Record<NonNullable<TerminalHeaderProps['statusColor']>, string> = {
  success: 'var(--text-success)',
  warning: 'var(--text-warning)',
  error: 'var(--text-error)',
};

export default function TerminalHeader({ title, subtitle, asciiArt, statusColor = 'success' }: TerminalHeaderProps) {
  const dotStyle: React.CSSProperties = { background: colorVarByStatus[statusColor] };
  return (
    <div className="terminal-header" aria-label="Terminal header">
      {asciiArt && (
        <div className="ascii-title">
          <pre className="ascii-art" aria-hidden>
            {asciiArt}
          </pre>
        </div>
      )}
      <div className="terminal-subtitle">
        <span className="status-dot" style={dotStyle} />
        <span>{title}{subtitle ? ` — ${subtitle}` : ''}</span>
      </div>
    </div>
  );
}
