'use client';

import { useState } from 'react';

interface PanelProps {
  visible: boolean;
  setPanelVisible: (visible: boolean) => void;
}

export default function Panel({ visible, setPanelVisible }: PanelProps) {
  const [activeTab, setActiveTab] = useState('terminal');
  const [terminalLines, setTerminalLines] = useState<string[]>([
    'Microsoft Windows [Version 10.0.19045.3803]',
    '(c) Microsoft Corporation. All rights reserved.',
    '',
    'E:\\meteoroid>npm run dev',
    '',
    '> meteoroid@0.1.0 dev',
    '> next dev',
    '',
    '  ▲ Next.js 13.5.1',
    '  - Local:        http://localhost:3000',
    '  - Ready in 2.1s',
    '',
  ]);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const cmd = inputValue.trim();
      let output = '';

      if (cmd === 'clear' || cmd === 'cls') {
        setTerminalLines([]);
        setInputValue('');
        return;
      } else if (cmd === 'npm run dev') {
        output = '\n> meteoroid@0.1.0 dev\n> next dev\n\n  ▲ Next.js 13.5.1\n  - Local:        http://localhost:3000\n  - Ready in 2.1s\n';
      } else if (cmd === 'npm run build') {
        output = '\n> meteoroid@0.1.0 build\n> next build\n\n  Creating an optimized production build ...\n  ✓ Compiled successfully\n  ✓ Collecting page data\n  ✓ Generating static pages\n  ✓ Finalizing page optimization\n';
      } else if (cmd === 'npm install') {
        output = '\nadded 379 packages in 12s\n\n141 packages are looking for funding\n  run `npm fund` for details\n';
      } else if (cmd === 'node -v') {
        output = 'v20.11.0';
      } else if (cmd === 'npm -v') {
        output = '10.2.4';
      } else if (cmd === 'git status') {
        output = 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean';
      } else if (cmd.startsWith('echo ')) {
        output = cmd.slice(5);
      } else {
        output = `'${cmd}' is not recognized as an internal or external command,\noperable program or batch file.`;
      }

      setCommandHistory([...commandHistory, cmd]);
      setHistoryIndex(-1);
      setTerminalLines([
        ...terminalLines,
        `E:\\meteoroid>${cmd}`,
        output,
        '',
      ]);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputValue('');
        } else {
          setHistoryIndex(newIndex);
          setInputValue(commandHistory[newIndex]);
        }
      }
    }
  };

  if (!visible) return null;

  return (
    <div
      className="flex flex-col"
      style={{ height: '200px', borderTop: '1px solid var(--border-color)', background: 'var(--panel-bg)' }}
    >
      <div className="flex items-center justify-between px-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex">
          {['problems', 'output', 'terminal', 'debug console'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-xs capitalize ${
                activeTab === tab
                  ? 'text-[var(--text-primary)] border-b border-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {tab}
              {tab === 'problems' && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-[var(--bg-active)] rounded-full">0</span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-5 h-5 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded"
            title="Maximize Panel"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 3h10v10H3V3zm1 1v8h8V4H4z"/>
            </svg>
          </button>
          <button
            className="w-5 h-5 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded"
            onClick={() => setPanelVisible(false)}
            title="Close Panel"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'terminal' && (
          <div className="h-full flex flex-col p-2 font-mono text-xs">
            <div className="flex-1 overflow-y-auto">
              {terminalLines.map((line, i) => (
                <div key={i} className="text-[var(--text-secondary)] leading-5 whitespace-pre-wrap">
                  {line.startsWith('E:\\') ? (
                    <>
                      <span className="text-[#6a9955]">{line.split('>')[0]}&gt;</span>
                      <span className="text-[var(--text-primary)]">{line.split('>').slice(1).join('>') || ''}</span>
                    </>
                  ) : line.includes('Ready') || line.includes('✓') ? (
                    <span className="text-[#6a9955]">{line}</span>
                  ) : line.includes('added') || line.includes('packages') ? (
                    <span className="text-[#569cd6]">{line}</span>
                  ) : line.includes('Error') || line.includes('error') ? (
                    <span className="text-[#f44747]">{line}</span>
                  ) : line.includes('warn') ? (
                    <span className="text-[#cca700]">{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center mt-1">
              <span className="text-[#6a9955]">E:\meteoroid&gt;</span>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-[var(--text-primary)] outline-none ml-1"
                autoFocus
              />
            </div>
          </div>
        )}
        {activeTab === 'problems' && (
          <div className="p-4 text-xs text-[var(--text-muted)]">
            No problems have been detected in the workspace.
          </div>
        )}
        {activeTab === 'output' && (
          <div className="p-4 text-xs text-[var(--text-secondary)] font-mono space-y-1">
            <div>[2026-05-18 07:10:56] Meteoroid Code Editor initialized</div>
            <div>[2026-05-18 07:10:57] Monaco Editor loaded successfully</div>
            <div>[2026-05-18 07:10:58] Workspace: E:\meteoroid</div>
            <div>[2026-05-18 07:10:59] Next.js 13.5.1 detected</div>
            <div>[2026-05-18 07:11:00] TypeScript 5.2.2 configured</div>
            <div>[2026-05-18 07:11:01] Tailwind CSS 3.3.3 active</div>
            <div>[2026-05-18 07:11:02] All extensions loaded successfully</div>
          </div>
        )}
        {activeTab === 'debug console' && (
          <div className="p-4 text-xs text-[var(--text-muted)]">
            Debug console is not active. Start a debugging session to see output here.
          </div>
        )}
      </div>
    </div>
  );
}
