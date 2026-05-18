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
    'E:\\meteoroid>npm install',
    'added 342 packages in 12s',
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
    'E:\\meteoroid>',
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setTerminalLines([...terminalLines, `E:\\meteoroid>${inputValue}`, `Command '${inputValue}' not found, but you can add custom commands!`, '']);
      setInputValue('');
    }
  };

  if (!visible) return null;

  return (
    <div
      className="flex flex-col"
      style={{ height: '200px', borderTop: '1px solid var(--border-color)', background: 'var(--panel-bg)' }}
    >
      {/* Panel Tabs */}
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
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            onClick={() => setPanelVisible(false)}
          >
            ×
          </button>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'terminal' && (
          <div className="h-full flex flex-col p-2 font-mono text-xs">
            <div className="flex-1 overflow-y-auto">
              {terminalLines.map((line, i) => (
                <div key={i} className="text-[var(--text-secondary)] leading-5">
                  {line.startsWith('E:\\') ? (
                    <>
                      <span className="text-[#6a9955]">{line.split('>')[0]}&gt;</span>
                      <span className="text-[var(--text-primary)]">{line.split('>').slice(1).join('>') || ''}</span>
                    </>
                  ) : line.includes('Ready') ? (
                    <span className="text-[#6a9955]">{line}</span>
                  ) : line.includes('added') ? (
                    <span className="text-[#569cd6]">{line}</span>
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
          <div className="p-4 text-xs text-[var(--text-secondary)] font-mono">
            [Info] Meteoroid Code Editor initialized
            <br />
            [Info] Monaco Editor loaded successfully
            <br />
            [Info] Workspace: E:\meteoroid
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
