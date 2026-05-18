'use client';

import { useState } from 'react';
import TitleBar from './TitleBar';
import ActivityBar from './ActivityBar';
import SideBar from './SideBar';
import EditorArea from './EditorArea';
import Panel from './Panel';
import StatusBar from './StatusBar';

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  path: string;
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
            content: `import React from 'react';\n\nconst App: React.FC = () => {\n  return (\n    <div className="app">\n      <h1>Hello, Meteoroid!</h1>\n      <p>Welcome to your new code editor.</p>\n    </div>\n  );\n};\n\nexport default App;`,
          },
          {
            name: 'Header.tsx',
            type: 'file',
            path: '/src/components/Header.tsx',
            content: `import React from 'react';\n\ninterface HeaderProps {\n  title: string;\n}\n\nconst Header: React.FC<HeaderProps> = ({ title }) => {\n  return (\n    <header>\n      <h1>{title}</h1>\n    </header>\n  );\n};\n\nexport default Header;`,
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
            content: `export function formatDate(date: Date): string {\n  return date.toLocaleDateString('en-US', {\n    year: 'numeric',\n    month: 'long',\n    day: 'numeric',\n  });\n}\n\nexport function debounce<T extends (...args: any[]) => any>(\n  func: T,\n  wait: number\n): (...args: Parameters<T>) => void {\n  let timeout: NodeJS.Timeout;\n  return (...args: Parameters<T>) => {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => func(...args), wait);\n  };\n}`,
          },
        ],
      },
      {
        name: 'index.tsx',
        type: 'file',
        path: '/src/index.tsx',
        content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './components/App';\n\nconst root = ReactDOM.createRoot(\n  document.getElementById('root') as HTMLElement\n);\n\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);`,
      },
    ],
  },
  {
    name: 'package.json',
    type: 'file',
    path: '/package.json',
    content: `{\n  "name": "meteoroid-app",\n  "version": "1.0.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "typescript": "^5.2.2"\n  },\n  "scripts": {\n    "start": "react-scripts start",\n    "build": "react-scripts build",\n    "test": "react-scripts test"\n  }\n}`,
  },
  {
    name: 'tsconfig.json',
    type: 'file',
    path: '/tsconfig.json',
    content: `{\n  "compilerOptions": {\n    "target": "es5",\n    "lib": ["dom", "dom.iterable", "esnext"],\n    "allowJs": true,\n    "skipLibCheck": true,\n    "esModuleInterop": true,\n    "allowSyntheticDefaultImports": true,\n    "strict": true,\n    "forceConsistentCasingInFileNames": true,\n    "noFallthroughCasesInSwitch": true,\n    "module": "esnext",\n    "moduleResolution": "node",\n    "resolveJsonModule": true,\n    "isolatedModules": true,\n    "noEmit": true,\n    "jsx": "react-jsx"\n  },\n  "include": ["src"]\n}`,
  },
  {
    name: 'README.md',
    type: 'file',
    path: '/README.md',
    content: `# Meteoroid App\n\nA modern web application built with React and TypeScript.\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm start\n\`\`\`\n\n## Features\n\n- React 18\n- TypeScript\n- Modern UI components`,
  },
];

export default function IDE() {
  const [files] = useState<FileNode[]>(defaultFiles);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [panelVisible, setPanelVisible] = useState(true);
  const [activeActivity, setActiveActivity] = useState('explorer');
  const [fileContents, setFileContents] = useState<Record<string, string>>({});

  const openFile = (file: FileNode) => {
    if (file.type !== 'file') return;
    if (!openFiles.find((f) => f.path === file.path)) {
      setOpenFiles([...openFiles, file]);
    }
    setActiveFile(file);
    if (!fileContents[file.path]) {
      setFileContents({ ...fileContents, [file.path]: file.content || '' });
    }
  };

  const closeFile = (path: string) => {
    const newOpenFiles = openFiles.filter((f) => f.path !== path);
    setOpenFiles(newOpenFiles);
    if (activeFile?.path === path) {
      setActiveFile(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      setFileContents({ ...fileContents, [activeFile.path]: value });
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--bg-primary)]">
      <TitleBar />
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
          />
          <Panel visible={panelVisible} setPanelVisible={setPanelVisible} />
        </div>
      </div>
      <StatusBar />
    </div>
  );
}
