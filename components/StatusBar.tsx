'use client';

import type { FileNode } from './IDE';

interface StatusBarProps {
  activeFile: FileNode | null;
  wordWrap: boolean;
  tabSize: number;
  fontSize: number;
}

export default function StatusBar({ activeFile, wordWrap, tabSize, fontSize }: StatusBarProps) {
  const getLanguage = (filename: string) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.jsx')) return 'TypeScript React';
    if (filename.endsWith('.ts')) return 'TypeScript';
    if (filename.endsWith('.js')) return 'JavaScript';
    if (filename.endsWith('.json')) return 'JSON';
    if (filename.endsWith('.css')) return 'CSS';
    if (filename.endsWith('.md')) return 'Markdown';
    if (filename.endsWith('.html')) return 'HTML';
    if (filename.endsWith('.py')) return 'Python';
    return 'Plain Text';
  };

  return (
    <div
      className="flex items-center justify-between h-6 px-3 text-xs select-none"
      style={{ background: 'var(--statusbar-bg)', color: '#ffffff' }}
    >
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1 hover:bg-[var(--accent-hover)] px-1 py-0.5 rounded">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0L1 4.5V11.5L8 16L15 11.5V4.5L8 0ZM8 1.5L13 4.5L8 7.5L3 4.5L8 1.5ZM1 5.5L7 9.5V14.5L1 10.5V5.5ZM9 14.5V9.5L15 5.5V10.5L9 14.5Z"/>
          </svg>
          <span>main*</span>
        </button>
        <button className="flex items-center gap-1 hover:bg-[var(--accent-hover)] px-1 py-0.5 rounded">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 10.5L2 6.5 3.5 5 6 7.5 10.5 3 12 4.5 6 10.5z"/>
          </svg>
          <span>0 errors, 0 warnings</span>
        </button>
      </div>
      <div className="flex items-center gap-3">
        {activeFile && (
          <>
            <span className="hover:bg-[var(--accent-hover)] px-1 py-0.5 rounded cursor-pointer">Ln 1, Col 1</span>
            <span className="hover:bg-[var(--accent-hover)] px-1 py-0.5 rounded cursor-pointer">Spaces: {tabSize}</span>
            <span className="hover:bg-[var(--accent-hover)] px-1 py-0.5 rounded cursor-pointer">UTF-8</span>
            <span className="hover:bg-[var(--accent-hover)] px-1 py-0.5 rounded cursor-pointer">CRLF</span>
            <span className="hover:bg-[var(--accent-hover)] px-1 py-0.5 rounded cursor-pointer">{getLanguage(activeFile.name)}</span>
          </>
        )}
        <span className="hover:bg-[var(--accent-hover)] px-1 py-0.5 rounded cursor-pointer">Prettier</span>
        <button className="flex items-center gap-1 hover:bg-[var(--accent-hover)] px-1 py-0.5 rounded">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
          </svg>
          <span>Feedback</span>
        </button>
      </div>
    </div>
  );
}
