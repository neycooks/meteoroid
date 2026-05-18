'use client';

import { useState, useCallback, useEffect } from 'react';
import TitleBar from './TitleBar';
import ActivityBar from './ActivityBar';
import SideBar from './SideBar';
import EditorArea from './EditorArea';
import Panel from './Panel';
import StatusBar from './StatusBar';
import CommandPalette from './CommandPalette';

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  path: string;
  language?: string;
}

const defaultFiles: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    path: '/src',
    children: [
      {
        name: 'components',
        type: 'folder',
        path: '/src/components',
        children: [
          {
            name: 'App.tsx',
            type: 'file',
            path: '/src/components/App.tsx',
            language: 'typescript',
            content: `import React from 'react';
import { Header } from './Header';

interface AppProps {
  title?: string;
}

const App: React.FC<AppProps> = ({ title = 'Meteoroid' }) => {
  const [count, setCount] = React.useState(0);

  return (
    <div className="app">
      <Header title={title} />
      <main>
        <p>Count: {count}</p>
        <button onClick={() => setCount(c => c + 1)}>
          Increment
        </button>
      </main>
    </div>
  );
};

export default App;`,
          },
          {
            name: 'Header.tsx',
            type: 'file',
            path: '/src/components/Header.tsx',
            language: 'typescript',
            content: `import React from 'react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </header>
  );
};`,
          },
        ],
      },
      {
        name: 'utils',
        type: 'folder',
        path: '/src/utils',
        children: [
          {
            name: 'helpers.ts',
            type: 'file',
            path: '/src/utils/helpers.ts',
            language: 'typescript',
            content: `export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function classNames(
  ...classes: (string | boolean | undefined)[]
): string {
  return classes.filter(Boolean).join(' ');
}`,
          },
          {
            name: 'api.ts',
            type: 'file',
            path: '/src/utils/api.ts',
            language: 'typescript',
            content: `const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(\`\${API_BASE}\${endpoint}\`, config);

  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};`,
          },
        ],
      },
      {
        name: 'styles',
        type: 'folder',
        path: '/src/styles',
        children: [
          {
            name: 'globals.css',
            type: 'file',
            path: '/src/styles/globals.css',
            language: 'css',
            content: `:root {
  --primary: #007acc;
  --background: #1e1e1e;
  --foreground: #cccccc;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--background);
  color: var(--foreground);
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #333;
}

.header nav a {
  color: var(--foreground);
  text-decoration: none;
  margin-left: 1rem;
}`,
          },
        ],
      },
      {
        name: 'index.tsx',
        type: 'file',
        path: '/src/index.tsx',
        language: 'typescript',
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/globals.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App title="Meteoroid App" />
  </React.StrictMode>
);`,
      },
    ],
  },
  {
    name: 'package.json',
    type: 'file',
    path: '/package.json',
    language: 'json',
    content: `{
  "name": "meteoroid-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.2.2"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}`,
  },
  {
    name: 'tsconfig.json',
    type: 'file',
    path: '/tsconfig.json',
    language: 'json',
    content: `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}`,
  },
  {
    name: 'README.md',
    type: 'file',
    path: '/README.md',
    language: 'markdown',
    content: `# Meteoroid App

A modern web application built with React and TypeScript.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- React 18 with TypeScript
- Modern UI components
- Hot module replacement
- ESLint integration

## Project Structure

\`\`\`
src/
├── components/    # React components
├── utils/         # Utility functions
├── styles/        # Global styles
└── index.tsx      # Entry point
\`\`\``,
  },
  {
    name: '.gitignore',
    type: 'file',
    path: '/.gitignore',
    language: 'plaintext',
    content: `node_modules/
.next/
dist/
.env.local
.env*.local
*.log
.DS_Store
coverage/
.vscode/
.idea/`,
  },
];

export default function IDE() {
  const [files, setFiles] = useState<FileNode[]>(defaultFiles);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [panelVisible, setPanelVisible] = useState(true);
  const [activeActivity, setActiveActivity] = useState('explorer');
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [splitEditor, setSplitEditor] = useState(false);
  const [secondActiveFile, setSecondActiveFile] = useState<FileNode | null>(null);
  const [secondOpenFiles, setSecondOpenFiles] = useState<FileNode[]>([]);
  const [secondFileContents, setSecondFileContents] = useState<Record<string, string>>({});
  const [minimapEnabled, setMinimapEnabled] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarVisible((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setPanelVisible((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        setSplitEditor((v) => !v);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openFile = useCallback(
    (file: FileNode) => {
      if (file.type !== 'file') return;
      if (!openFiles.find((f) => f.path === file.path)) {
        setOpenFiles((prev) => [...prev, file]);
      }
      setActiveFile(file);
      if (!fileContents[file.path]) {
        setFileContents((prev) => ({ ...prev, [file.path]: file.content || '' }));
      }
    },
    [openFiles, fileContents]
  );

  const closeFile = useCallback(
    (path: string) => {
      const newOpenFiles = openFiles.filter((f) => f.path !== path);
      setOpenFiles(newOpenFiles);
      if (activeFile?.path === path) {
        setActiveFile(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null);
      }
    },
    [openFiles, activeFile]
  );

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      if (activeFile && value !== undefined) {
        setFileContents((prev) => ({ ...prev, [activeFile.path]: value }));
      }
    },
    [activeFile]
  );

  const handleCommand = useCallback(
    (command: string) => {
      switch (command) {
        case 'toggle-sidebar':
          setSidebarVisible((v) => !v);
          break;
        case 'toggle-panel':
          setPanelVisible((v) => !v);
          break;
        case 'toggle-minimap':
          setMinimapEnabled((v) => !v);
          break;
        case 'toggle-wordwrap':
          setWordWrap((v) => !v);
          break;
        case 'split-editor':
          setSplitEditor((v) => !v);
          break;
        case 'increase-font':
          setFontSize((v) => Math.min(v + 2, 32));
          break;
        case 'decrease-font':
          setFontSize((v) => Math.max(v - 2, 8));
          break;
        case 'toggle-settings':
          setShowSettings((v) => !v);
          break;
      }
      setCommandPaletteOpen(false);
    },
    []
  );

  const commands = [
    { id: 'toggle-sidebar', label: 'View: Toggle Sidebar', keybinding: 'Ctrl+B' },
    { id: 'toggle-panel', label: 'View: Toggle Panel', keybinding: 'Ctrl+`' },
    { id: 'toggle-minimap', label: 'View: Toggle Minimap' },
    { id: 'toggle-wordwrap', label: 'View: Toggle Word Wrap' },
    { id: 'split-editor', label: 'View: Split Editor', keybinding: 'Ctrl+\\' },
    { id: 'increase-font', label: 'Editor: Increase Font Size' },
    { id: 'decrease-font', label: 'Editor: Decrease Font Size' },
    { id: 'toggle-settings', label: 'Preferences: Open Settings' },
    { id: 'format', label: 'Format Document', keybinding: 'Shift+Alt+F' },
    { id: 'save', label: 'File: Save', keybinding: 'Ctrl+S' },
    { id: 'find', label: 'Find in File', keybinding: 'Ctrl+F' },
    { id: 'replace', label: 'Replace in File', keybinding: 'Ctrl+H' },
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--bg-primary)]">
      <TitleBar onCommand={() => setCommandPaletteOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <ActivityBar
          activeActivity={activeActivity}
          setActiveActivity={setActiveActivity}
          sidebarVisible={sidebarVisible}
          setSidebarVisible={setSidebarVisible}
        />
        {sidebarVisible && (
          <SideBar
            files={files}
            openFile={openFile}
            activeFile={activeFile}
            activeActivity={activeActivity}
          />
        )}
        <div className="flex flex-1 flex-col overflow-hidden">
          <EditorArea
            openFiles={openFiles}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            closeFile={closeFile}
            fileContents={fileContents}
            onEditorChange={handleEditorChange}
            splitEditor={splitEditor}
            secondActiveFile={secondActiveFile}
            secondOpenFiles={secondOpenFiles}
            secondFileContents={secondFileContents}
            minimapEnabled={minimapEnabled}
            wordWrap={wordWrap}
            fontSize={fontSize}
            tabSize={tabSize}
          />
          <Panel visible={panelVisible} setPanelVisible={setPanelVisible} />
        </div>
      </div>
      <StatusBar
        activeFile={activeFile}
        wordWrap={wordWrap}
        tabSize={tabSize}
        fontSize={fontSize}
      />
      {commandPaletteOpen && (
        <CommandPalette
          commands={commands}
          onCommand={handleCommand}
          onClose={() => setCommandPaletteOpen(false)}
        />
      )}
    </div>
  );
}
