import React from 'react';

export type TerminalCommandProps = {
  name: string;
  params?: string;
  description?: string;
  children?: React.ReactNode;
};

export default function TerminalCommand({ name, params, description, children }: TerminalCommandProps) {
  return (
    <div className="terminal-command" role="group" aria-label={`Command ${name}`}>
      <div className="header-content">
        <h2 className="search-title">
          <span className="terminal-dot" />
          <strong>{name}</strong>
          {params && <span className="title-params">({params})</span>}
        </h2>
        {description && <p className="search-subtitle">⎿ {description}</p>}
      </div>
      {children}
    </div>
  );
}
