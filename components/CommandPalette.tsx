'use client';

import { useState, useRef, useEffect } from 'react';

interface Command {
  id: string;
  label: string;
  keybinding?: string;
}

interface CommandPaletteProps {
  commands: Command[];
  onCommand: (id: string) => void;
  onClose: () => void;
}

export default function CommandPalette({ commands, onCommand, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      onCommand(filtered[selectedIndex].id);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" onClick={onClose}>
      <div
        className="w-full max-w-xl shadow-2xl"
        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-3 py-2 border-b border-[var(--border-color)]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--text-muted)" className="mr-2">
            <path d="M11.5 7a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-[var(--text-primary)] text-sm outline-none placeholder-[var(--text-muted)]"
          />
        </div>
        <div className="max-h-72 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="px-4 py-3 text-xs text-[var(--text-muted)]">No matching commands</div>
          )}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm ${
                i === selectedIndex ? 'bg-[var(--bg-active)]' : ''
              } hover:bg-[var(--bg-active)]`}
              onClick={() => onCommand(cmd.id)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <span className="text-[var(--text-primary)]">{cmd.label}</span>
              {cmd.keybinding && (
                <kbd className="text-xs text-[var(--text-muted)] bg-[var(--bg-input)] px-1.5 py-0.5 rounded">
                  {cmd.keybinding}
                </kbd>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
