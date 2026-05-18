'use client';

import Editor from '@monaco-editor/react';
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
  if (filename.endsWith('.gitignore')) return 'plaintext';
  return 'plaintext';
};

const getFileIcon = (name: string) => {
  if (name.endsWith('.tsx') || name.endsWith('.ts')) {
    return <span className="text-[#519aba] text-[10px] font-bold">TS</span>;
  }
  if (name.endsWith('.jsx') || name.endsWith('.js')) {
    return <span className="text-[#f1e05a] text-[10px] font-bold">JS</span>;
  }
  if (name.endsWith('.json')) {
    return <span className="text-[#cbcb41] text-[10px] font-bold">{}</span>;
  }
  if (name.endsWith('.css')) {
    return <span className="text-[#56b3b3] text-[10px] font-bold">#</span>;
  }
  if (name.endsWith('.md')) {
    return <span className="text-[#519aba] text-[10px] font-bold">MD</span>;
  }
  return <span className="text-[var(--text-secondary)] text-[10px]">📄</span>;
};

function TabBar({
  files,
  activeFile,
  setActiveFile,
  closeFile,
  fileContents,
  onEditorChange,
}: {
  files: FileNode[];
  activeFile: FileNode | null;
  setActiveFile: (file: FileNode) => void;
  closeFile: (path: string) => void;
  fileContents: Record<string, string>;
  onEditorChange: (value: string | undefined) => void;
}) {
  return (
    <div
      className="flex items-center overflow-x-auto"
      style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}
    >
      {files.map((file) => (
        <div
          key={file.path}
          className={`flex items-center gap-2 px-3 py-2 text-xs cursor-pointer border-r border-[var(--border-color)] min-w-fit ${
            activeFile?.path === file.path
              ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] border-t-2 border-t-[var(--accent)]'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
          }`}
          onClick={() => setActiveFile(file)}
        >
          {getFileIcon(file.name)}
          <span>{file.name}</span>
          <button
            className="ml-2 w-4 h-4 flex items-center justify-center rounded hover:bg-[var(--bg-active)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            onClick={(e) => {
              e.stopPropagation();
              closeFile(file.path);
            }}
          >
            ×
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
      className="flex items-center gap-1 px-4 py-1 text-xs text-[var(--text-muted)]"
      style={{ background: 'var(--breadcrumb-bg)', borderBottom: '1px solid var(--border-color)' }}
    >
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-[var(--text-muted)]">›</span>}
          <span className={i === parts.length - 1 ? 'text-[var(--text-secondary)]' : ''}>{part}</span>
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
        fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
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
        scrollbar: {
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
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
          <svg
            width="128"
            height="128"
            viewBox="0 0 100 100"
            fill="none"
            className="mx-auto mb-6 opacity-20"
          >
            <path d="M85 20L50 5L15 20L50 35L85 20Z" fill="var(--accent)" />
            <path d="M15 20V80L50 95V35L15 20Z" fill="var(--text-secondary)" />
            <path d="M50 35V95L85 80V20L50 35Z" fill="var(--text-primary)" />
          </svg>
          <h2 className="text-2xl font-light text-[var(--text-muted)] mb-4">Meteoroid</h2>
          <div className="text-xs text-[var(--text-muted)] space-y-1">
            <p className="flex items-center justify-center gap-2">
              Show All Commands
              <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)]">Ctrl+Shift+P</kbd>
            </p>
            <p className="flex items-center justify-center gap-2">
              Go to File
              <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)]">Ctrl+P</kbd>
            </p>
            <p className="flex items-center justify-center gap-2">
              Toggle Sidebar
              <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)]">Ctrl+B</kbd>
            </p>
            <p className="flex items-center justify-center gap-2">
              Toggle Terminal
              <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)]">Ctrl+`</kbd>
            </p>
            <p className="flex items-center justify-center gap-2">
              Split Editor
              <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)]">Ctrl+\</kbd>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-1 overflow-hidden ${splitEditor ? 'flex-row' : 'flex-col'}`}>
      {/* Primary Editor */}
      <div className={`flex flex-col overflow-hidden ${splitEditor ? 'w-1/2 border-r border-[var(--border-color)]' : 'flex-1'}`}>
        <TabBar
          files={openFiles}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          closeFile={closeFile}
          fileContents={fileContents}
          onEditorChange={onEditorChange}
        />
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

      {/* Split Editor */}
      {splitEditor && (
        <div className="flex flex-col w-1/2 overflow-hidden">
          {secondOpenFiles.length > 0 ? (
            <>
              <TabBar
                files={secondOpenFiles}
                activeFile={secondActiveFile}
                setActiveFile={setSecondActiveFile}
                closeFile={closeSecondFile}
                fileContents={secondFileContents}
                onEditorChange={onSecondEditorChange}
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
