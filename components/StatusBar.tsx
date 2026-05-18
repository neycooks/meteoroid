'use client';

import { GitBranch, CheckCircle, AlertCircle } from 'lucide-react';
import type { FileNode } from './IDE';

interface StatusBarProps {
  activeFile: FileNode | null;
  wordWrap: boolean;
  tabSize: number;
  fontSize: number;
}

export default function StatusBar({ activeFile, wordWrap, tabSize, fontSize }: StatusBarProps) {
  const getLanguage = (filename: string) => {
    if (filename.endsWith('.tsx')) return 'TypeScript React';
    if (filename.endsWith('.ts')) return 'TypeScript';
    if (filename.endsWith('.jsx')) return 'JavaScript React';
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
      className="flex items-center justify-between h-6 px-3 text-[11px] select-none"
      style={{ background: 'var(--statusbar-bg)', color: '#ffffff' }}
    >
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded transition-colors">
          <GitBranch size={11} />
          <span>main</span>
        </button>
        <button className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded transition-colors">
          <CheckCircle size={11} />
          <span>0 errors</span>
        </button>
      </div>
      <div className="flex items-center gap-2">
        {activeFile && (
          <>
            <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer transition-colors">Ln 1, Col 1</span>
            <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer transition-colors">Spaces: {tabSize}</span>
            <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer transition-colors">UTF-8</span>
            <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer transition-colors">{getLanguage(activeFile.name)}</span>
          </>
        )}
        <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer transition-colors">Prettier</span>
      </div>
    </div>
  );
}
