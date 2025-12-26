"use client";
import React, { useState } from 'react';

export type Chip = {
  label: string;
  type: string;
  emoji?: string;
};

export type FilterChipsProps = {
  chips: Chip[];
  onChange?: (active: string[]) => void;
};

export default function FilterChips({ chips, onChange }: FilterChipsProps) {
  const [active, setActive] = useState<string[]>([]);

  const toggle = (type: string) => {
    const next = active.includes(type) ? active.filter((t) => t !== type) : [...active, type];
    setActive(next);
    onChange?.(next);
  };

  return (
    <div className="component-type-filters" role="group" aria-label="Filter chips">
      <div className="filter-group">
        <span className="filter-group-label">type:</span>
        <div className="filter-chips">
          {chips.map((chip) => (
            <button
              key={chip.type}
              type="button"
              className={`filter-chip ${active.includes(chip.type) ? 'active' : ''}`}
              data-filter={chip.type}
              onClick={() => toggle(chip.type)}
              aria-pressed={active.includes(chip.type)}
            >
              {chip.emoji && <span className="chip-icon" aria-hidden>{chip.emoji}</span>}
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
