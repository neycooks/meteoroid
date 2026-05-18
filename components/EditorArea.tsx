'use client';

import Editor from '@monaco-editor/react';
import { X, FileCode, FileJson, FileType, FileText } from 'lucide-react';
import type { FileNode } from './IDE';

interface EditorAreaProps {
  openFiles: FileNode[];
  activeFile: FileNode | null;
  setActiveFile: (file: FileNode) => void;
  closeFile: (path: string) => void;
  fileContents: Record<string, string>;
  onEditorChange: (value: string | undefined) => void;
  splitEditor: boolean;
  secondActiveFile: FileNode | null;
  setSecondActiveFile: (file: FileNode) => void;
  secondOpenFiles: FileNode[];
  setSecondOpenFiles: (files: FileNode[]) => void;
  secondFileContents: Record<string, string>;
  onSecondEditorChange: (value: string | undefined) => void;
  closeSecondFile: (path: string) => void;
  minimapEnabled: boolean;
  wordWrap: boolean;
  fontSize: number;
  tabSize: number;
}

const getLanguage = (filename: string) => {
  if (filename.endsWith('.tsx') || filename.endsWith('.jsx')) return 'typescript';
  if (filename.endsWith('.ts') || filename.endsWith('.js')) return 'javascript';
  if (filename.endsWith('.json')) return 'json';
  if (filename.endsWith('.css')) return 'css';
  if (filename.endsWith('.md')) return 'markdown';
  if (filename.endsWith('.html')) return 'html';
  if (filename.endsWith('.py')) return 'python';
  if (filename.endsWith('.xml')) return 'xml';
  if (filename.endsWith('.yaml') || filename.endsWith('.yml')) return 'yaml';
  if (filename.endsWith('.sh')) return 'shell';
  return 'plaintext';
};

const getFileIcon = (name: string) => {
  if (name.endsWith('.tsx') || name.endsWith('.ts')) {
    return <FileCode size={12} className="text-[#519aba]" />;
  }
  if (name.endsWith('.jsx') || name.endsWith('.js')) {
    return <FileCode size={12} className="text-[#f1e05a]" />;
  }
  if (name.endsWith('.json')) {
    return <FileJson size={12} className="text-[#cbcb41]" />;
  }
  if (name.endsWith('.css')) {
    return <FileType size={12} className="text-[#56b3b3]" />;
  }
  if (name.endsWith('.md')) {
    return <FileText size={12} className="text-[#519aba]" />;
  }
  return <FileText size={12} className="text-[var(--text-secondary)]" />;
};

function TabBar({
  files,
  activeFile,
  setActiveFile,
  closeFile,
}: {
  files: FileNode[];
  activeFile: FileNode | null;
  setActiveFile: (file: FileNode) => void;
  closeFile: (path: string) => void;
}) {
  return (
    <div
      className="flex items-center overflow-x-auto"
      style={{ background: 'var(--bg-secondary)' }}
    >
      {files.map((file) => (
        <div
          key={file.path}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs cursor-pointer border-r border-[var(--border-color)] min-w-fit transition-colors ${
            activeFile?.path === file.path
              ? 'bg-[var(--tab-active)] text-[var(--text-primary)] border-t-2 border-t-[var(--accent)]'
              : 'bg-[var(--tab-inactive)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
          }`}
          onClick={() => setActiveFile(file)}
        >
          {getFileIcon(file.name)}
          <span>{file.name}</span>
          <button
            className="ml-1 w-4 h-4 flex items-center justify-center rounded-sm hover:bg-[var(--bg-active)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              closeFile(file.path);
            }}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

function Breadcrumbs({ file }: { file: FileNode | null }) {
  if (!file) return null;
  const parts = file.path.split('/').filter(Boolean);
  return (
    <div
      className="flex items-center gap-1 px-3 py-1 text-[11px] text-[var(--text-muted)]"
      style={{ background: 'var(--breadcrumb-bg)', borderBottom: '1px solid var(--border-color)' }}
    >
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-[var(--border-light)]">/</span>}
          <span className={i === parts.length - 1 ? 'text-[var(--text-secondary)]' : 'hover:text-[var(--text-primary)] cursor-pointer'}>
            {part}
          </span>
        </span>
      ))}
    </div>
  );
}

function MonacoEditor({
  file,
  content,
  onChange,
  minimapEnabled,
  wordWrap,
  fontSize,
  tabSize,
}: {
  file: FileNode;
  content: string;
  onChange: (value: string | undefined) => void;
  minimapEnabled: boolean;
  wordWrap: boolean;
  fontSize: number;
  tabSize: number;
}) {
  return (
    <Editor
      height="100%"
      defaultLanguage={getLanguage(file.name)}
      language={getLanguage(file.name)}
      value={content}
      onChange={onChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: minimapEnabled },
        fontSize,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
        fontLigatures: true,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: true,
        scrollBeyondLastColumn: 5,
        automaticLayout: true,
        tabSize,
        wordWrap: wordWrap ? 'on' : 'off',
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true, indentation: true },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        quickSuggestions: true,
        folding: true,
        foldingHighlight: true,
        showFoldingControls: 'mouseover',
        matchBrackets: 'always',
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        formatOnPaste: true,
        formatOnType: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        padding: { top: 8, bottom: 8 },
        renderWhitespace: 'selection',
        renderControlCharacters: false,
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
        contextmenu: true,
        mouseWheelZoom: true,
        links: true,
        colorDecorators: true,
        stickyScroll: { enabled: true },
        inlayHints: { enabled: 'on' },
      }}
    />
  );
}

export default function EditorArea({
  openFiles,
  activeFile,
  setActiveFile,
  closeFile,
  fileContents,
  onEditorChange,
  splitEditor,
  secondActiveFile,
  setSecondActiveFile,
  secondOpenFiles,
  setSecondOpenFiles,
  secondFileContents,
  onSecondEditorChange,
  closeSecondFile,
  minimapEnabled,
  wordWrap,
  fontSize,
  tabSize,
}: EditorAreaProps) {
  if (openFiles.length === 0) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center"
        style={{ background: 'var(--editor-bg)' }}
      >
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 opacity-10">
            <FileCode size={96} className="text-[var(--text-primary)] w-full h-full" />
          </div>
          <h2 className="text-xl font-light text-[var(--text-muted)] mb-6">Meteoroid</h2>
          <div className="text-xs text-[var(--text-muted)] space-y-2">
            <p className="flex items-center justify-center gap-2">
              Show All Commands
              <kbd className="px-2 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)] text-[11px]">Ctrl+Shift+P</kbd>
            </p>
            <p className="flex items-center justify-center gap-2">
              Go to File
              <kbd className="px-2 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)] text-[11px]">Ctrl+P</kbd>
            </p>
            <p className="flex items-center justify-center gap-2">
              Toggle Sidebar
              <kbd className="px-2 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)] text-[11px]">Ctrl+B</kbd>
            </p>
            <p className="flex items-center justify-center gap-2">
              Toggle Terminal
              <kbd className="px-2 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)] text-[11px]">Ctrl+`</kbd>
            </p>
            <p className="flex items-center justify-center gap-2">
              Split Editor
              <kbd className="px-2 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)] text-[11px]">Ctrl+\</kbd>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-1 overflow-hidden ${splitEditor ? 'flex-row' : 'flex-col'}`}>
      <div className={`flex flex-col overflow-hidden ${splitEditor ? 'w-1/2 border-r border-[var(--border-color)]' : 'flex-1'}`}>
        <TabBar files={openFiles} activeFile={activeFile} setActiveFile={setActiveFile} closeFile={closeFile} />
        <Breadcrumbs file={activeFile} />
        <div className="flex-1 overflow-hidden">
          {activeFile && (
            <MonacoEditor
              file={activeFile}
              content={fileContents[activeFile.path] || activeFile.content || ''}
              onChange={onEditorChange}
              minimapEnabled={minimapEnabled}
              wordWrap={wordWrap}
              fontSize={fontSize}
              tabSize={tabSize}
            />
          )}
        </div>
      </div>

      {splitEditor && (
        <div className="flex flex-col w-1/2 overflow-hidden">
          {secondOpenFiles.length > 0 ? (
            <>
              <TabBar
                files={secondOpenFiles}
                activeFile={secondActiveFile}
                setActiveFile={setSecondActiveFile}
                closeFile={closeSecondFile}
              />
              <Breadcrumbs file={secondActiveFile} />
              <div className="flex-1 overflow-hidden">
                {secondActiveFile && (
                  <MonacoEditor
                    file={secondActiveFile}
                    content={secondFileContents[secondActiveFile.path] || secondActiveFile.content || ''}
                    onChange={onSecondEditorChange}
                    minimapEnabled={minimapEnabled}
                    wordWrap={wordWrap}
                    fontSize={fontSize}
                    tabSize={tabSize}
                  />
                )}
              </div>
            </>
          ) : (
            <div
              className="flex-1 flex items-center justify-center text-xs text-[var(--text-muted)]"
              style={{ background: 'var(--editor-bg)' }}
            >
              Open a file in the split editor
            </div>
          )}
        </div>
      )}
    </div>
  );
}
