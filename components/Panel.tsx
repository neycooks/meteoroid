'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, Terminal, AlertCircle, SquareTerminal, Bug } from 'lucide-react';

interface PanelProps {
  visible: boolean;
  setPanelVisible: (visible: boolean) => void;
}

const commandOutputs: Record<string, string> = {
  'npm run dev': '\n> meteoroid@0.1.0 dev\n> next dev\n\n  ▲ Next.js 13.5.1\n  - Local:        http://localhost:3000\n  - Ready in 2.1s\n',
  'npm run build': '\n> meteoroid@0.1.0 build\n> next build\n\n  Creating an optimized production build ...\n  ✓ Compiled successfully\n  ✓ Collecting page data\n  ✓ Generating static pages\n  ✓ Finalizing page optimization\n',
  'npm install': '\nadded 379 packages in 12s\n\n141 packages are looking for funding\n  run `npm fund` for details\n',
  'npm start': '\n> meteoroid@0.1.0 start\n> next start\n\n  ▲ Next.js 13.5.1\n  - Local:        http://localhost:3000\n  - Ready in 1.4s\n',
  'node -v': 'v20.11.0',
  'npm -v': '10.2.4',
  'git status': 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean',
  'git log --oneline -5': '8daaaf1 (HEAD -> main, origin/main) fix: add missing split editor props\n42041ac feat: initialize Meteoroid code editor\nd4b12fa fix: replace react-icons with inline SVGs',
  'ls': 'app/\ncomponents/\nnode_modules/\npublic/\nresources/\n.eslintrc.json\n.gitignore\nnext.config.js\npackage.json\npackage-lock.json\npostcss.config.js\nREADME.md\ntailwind.config.ts\ntsconfig.json',
  'pwd': 'E:\\meteoroid',
  'date': new Date().toString(),
  'whoami': 'meteoroid-user',
  'help': 'Available commands:\n  npm run dev     - Start development server\n  npm run build   - Build for production\n  npm install     - Install dependencies\n  node -v         - Show Node.js version\n  npm -v          - Show npm version\n  git status      - Show git status\n  git log         - Show git log\n  ls              - List files\n  pwd             - Print working directory\n  date            - Show current date\n  clear/cls       - Clear terminal\n  echo <text>     - Print text\n  help            - Show this help',
};

export default function Panel({ visible, setPanelVisible }: PanelProps) {
  const [activeTab, setActiveTab] = useState('terminal');
  const [terminalLines, setTerminalLines] = useState<string[]>([
    'Microsoft Windows [Version 10.0.19045.3803]',
    '(c) Microsoft Corporation. All rights reserved.',
    '',
  ]);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const cmd = inputValue.trim();

      if (cmd === 'clear' || cmd === 'cls') {
        setTerminalLines([]);
        setInputValue('');
        return;
      }

      let output = '';
      if (cmd.startsWith('echo ')) {
        output = cmd.slice(5);
      } else if (cmd.startsWith('mkdir ')) {
        output = `Directory '${cmd.slice(6)}' created.`;
      } else if (cmd.startsWith('touch ') || cmd.startsWith('cat ')) {
        output = `File '${cmd.slice(6)}' ${cmd.startsWith('touch') ? 'created' : 'not found'}.`;
      } else if (cmd.startsWith('npm run')) {
        output = commandOutputs[cmd] || `\n> meteoroid@0.1.0 ${cmd.split(' ').slice(2).join(' ')}\n> next ${cmd.split(' ').slice(2).join(' ')}\n\n  ▲ Next.js 13.5.1\n  - Ready\n`;
      } else if (commandOutputs[cmd]) {
        output = commandOutputs[cmd];
      } else {
        output = `'${cmd}' is not recognized as an internal or external command.`;
      }

      setCommandHistory([...commandHistory, cmd]);
      setHistoryIndex(-1);
      setTerminalLines((prev) => [...prev, `E:\\meteoroid> ${cmd}`, output, '']);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
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

  const tabs = [
    { id: 'problems', icon: AlertCircle, label: 'Problems', count: 0 },
    { id: 'output', icon: SquareTerminal, label: 'Output' },
    { id: 'terminal', icon: Terminal, label: 'Terminal' },
    { id: 'debug', icon: Bug, label: 'Debug Console' },
  ];

  return (
    <div
      className="flex flex-col transition-all duration-200"
      style={{
        height: isMaximized ? 'calc(100vh - 36px - 48px - 24px)' : '200px',
        borderTop: '1px solid var(--border-color)',
        background: 'var(--panel-bg)',
      }}
    >
      <div className="flex items-center justify-between px-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex">
          {tabs.map(({ id, icon: Icon, label, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs transition-colors ${
                activeTab === id
                  ? 'text-[var(--text-primary)] border-b border-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <Icon size={12} />
              <span>{label}</span>
              {count !== undefined && count > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] bg-[var(--accent)] text-white rounded-full">{count}</span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button
            className="w-6 h-6 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
            onClick={() => setIsMaximized(!isMaximized)}
            title={isMaximized ? 'Minimize Panel' : 'Maximize Panel'}
          >
            {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
          <button
            className="w-6 h-6 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] rounded transition-colors"
            onClick={() => setPanelVisible(false)}
            title="Close Panel"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'terminal' && (
          <div className="h-full flex flex-col p-2 font-mono text-xs">
            <div ref={terminalRef} className="flex-1 overflow-y-auto">
              {terminalLines.map((line, i) => (
                <div key={i} className="text-[var(--text-secondary)] leading-5 whitespace-pre-wrap">
                  {line.startsWith('E:\\') ? (
                    <>
                      <span className="text-[#6a9955]">{line.split('>')[0]}&gt;</span>
                      <span className="text-[var(--text-primary)]">{line.split('>').slice(1).join('>').trim()}</span>
                    </>
                  ) : line.includes('✓') || line.includes('Ready') ? (
                    <span className="text-[#6a9955]">{line}</span>
                  ) : line.includes('added') || line.includes('packages') ? (
                    <span className="text-[#569cd6]">{line}</span>
                  ) : line.includes('Error') || line.includes('error') || line.includes('not recognized') ? (
                    <span className="text-[#f44747]">{line}</span>
                  ) : line.includes('warn') || line.includes('▲') ? (
                    <span className="text-[#cca700]">{line}</span>
                  ) : line.includes('>') || line.includes('meteoroid@') ? (
                    <span className="text-[#dcdcaa]">{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center mt-1">
              <span className="text-[#6a9955]">E:\meteoroid&gt;</span>
              <input
                ref={inputRef}
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
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)]">
            <AlertCircle size={24} className="mb-2 opacity-50" />
            <p className="text-xs">No problems detected</p>
          </div>
        )}
        {activeTab === 'output' && (
          <div className="p-3 text-xs text-[var(--text-secondary)] font-mono space-y-1 overflow-y-auto h-full">
            <div className="text-[#6a9955]">[2026-05-18 07:10:56] Meteoroid Code Editor initialized</div>
            <div className="text-[#6a9955]">[2026-05-18 07:10:57] Monaco Editor loaded successfully</div>
            <div>[2026-05-18 07:10:58] Workspace: E:\meteoroid</div>
            <div>[2026-05-18 07:10:59] Next.js 13.5.1 detected</div>
            <div>[2026-05-18 07:11:00] TypeScript 5.2.2 configured</div>
            <div>[2026-05-18 07:11:01] Tailwind CSS 3.3.3 active</div>
            <div className="text-[#6a9955]">[2026-05-18 07:11:02] All extensions loaded successfully</div>
          </div>
        )}
        {activeTab === 'debug' && (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)]">
            <Bug size={24} className="mb-2 opacity-50" />
            <p className="text-xs">Debug console is not active</p>
            <p className="text-[11px] mt-1">Start a debugging session to see output</p>
          </div>
        )}
      </div>
    </div>
  );
}
