'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';

interface Cmd {
  id: string;
  label: string;
  keybinding?: string;
}

interface CommandPaletteProps {
  commands: Cmd[];
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24" onClick={onClose}>
      <div
        className="w-full max-w-xl overflow-hidden"
        style={{
          background: 'var(--dropdown-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-3 py-2.5 border-b border-[var(--border-color)]">
          <Search size={16} className="text-[var(--text-muted)] mr-2 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-[var(--text-primary)] text-sm outline-none placeholder-[var(--text-muted)]"
          />
          <button
            onClick={onClose}
            className="ml-2 w-5 h-5 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
          >
            <X size={12} />
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto py-1.5">
          {filtered.length === 0 && (
            <div className="px-4 py-4 text-center text-xs text-[var(--text-muted)]">
              <Command size={20} className="mx-auto mb-2 opacity-30" />
              No matching commands
            </div>
          )}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                i === selectedIndex ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
              }`}
              onClick={() => onCommand(cmd.id)}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <span>{cmd.label}</span>
              {cmd.keybinding && (
                <kbd
                  className={`text-[11px] px-1.5 py-0.5 rounded ${
                    i === selectedIndex ? 'bg-white/20 text-white/80' : 'bg-[var(--bg-input)] text-[var(--text-muted)]'
                  }`}
                >
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
