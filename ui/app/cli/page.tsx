"use client";

import React from 'react';
import TerminalHeader from '../components/TerminalHeader';
import TerminalCommand from '../components/TerminalCommand';
import TerminalSearch from '../components/TerminalSearch';
import FilterChips from '../components/FilterChips';
import CommandLine from '../components/CommandLine';

const ASCII = String.raw`
  ___   _ _____      _           _           
 / _ \ / |_   _|__ _| |__  _ _  (_)_ _  __ _ 
| (_) | | || | / _` | '_ \| ' \ | | ' \/ _` |
 \___/  |_||_| \__,_|_.__/|_||_|/ |_|_|\__, |
                              |__/     |___/ 
`;

export default function CLIPage(): JSX.Element {
  return (
    <main className="terminal" id="main-content" aria-label="CLI Terminal UI">
      <section className="terminal-section">
        <TerminalHeader title="CLI UI" subtitle="terminal-inspired interface" asciiArt={ASCII} statusColor="success" />

        <TerminalCommand name="search" params="query:string" description="Find components and commands">
          <TerminalSearch placeholder="search components, commands..." onSubmit={(v) => console.log('search:', v)} />
        </TerminalCommand>

        <TerminalCommand name="filters" params="type:multi" description="Filter by component type">
          <FilterChips
            chips={[
              { label: 'components', type: 'components', emoji: '🧩' },
              { label: 'commands', type: 'commands', emoji: '⌨️' },
              { label: 'examples', type: 'examples', emoji: '📖' },
            ]}
            onChange={(a) => console.log('filters:', a)}
          />
        </TerminalCommand>

        <TerminalCommand name="examples" params="copy:button" description="Command line examples">
          <div style={{ display: 'grid', gap: 12 }}>
            <CommandLine command="aidevelo build --target web --theme terminal" />
            <CommandLine command="aidevelo run --agent cli-ui-designer" />
            <CommandLine command="aidevelo deploy --platform pages" />
          </div>
        </TerminalCommand>
      </section>
    </main>
  );
}
