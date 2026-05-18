'use client';

import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import type { FileNode } from './IDE';

interface EditorAreaProps {
  openFiles: FileNode[];
  activeFile: FileNode | null;
  setActiveFile: (file: FileNode) => void;
  closeFile: (path: string) => void;
  fileContents: Record<string, string>;
  onEditorChange: (value: string | undefined) => void;
}

export default function EditorArea({
  openFiles,
  activeFile,
  setActiveFile,
  closeFile,
  fileContents,
  onEditorChange,
}: EditorAreaProps) {
  const [breadcrumbs] = useState(true);

  const getLanguage = (filename: string) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.jsx')) return 'typescript';
    if (filename.endsWith('.ts') || filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.json')) return 'json';
    if (filename.endsWith('.css')) return 'css';
    if (filename.endsWith('.md')) return 'markdown';
    if (filename.endsWith('.html')) return 'html';
    if (filename.endsWith('.py')) return 'python';
    return 'plaintext';
  };

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
            <path
              d="M85 20L50 5L15 20L50 35L85 20Z"
              fill="var(--accent)"
            />
            <path
              d="M15 20V80L50 95V35L15 20Z"
              fill="var(--text-secondary)"
            />
            <path
              d="M50 35V95L85 80V20L50 35Z"
              fill="var(--text-primary)"
            />
          </svg>
          <h2 className="text-2xl font-light text-[var(--text-muted)] mb-4">Meteoroid</h2>
          <div className="text-xs text-[var(--text-muted)] space-y-1">
            <p>Show All Commands <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)]">Ctrl+Shift+P</kbd></p>
            <p>Go to File <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)]">Ctrl+P</kbd></p>
            <p>Find in Files <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] rounded text-[var(--text-secondary)]">Ctrl+Shift+F</kbd></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Tabs */}
      <div
        className="flex items-center overflow-x-auto"
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}
      >
        {openFiles.map((file) => (
          <div
            key={file.path}
            className={`flex items-center gap-2 px-3 py-2 text-xs cursor-pointer border-r border-[var(--border-color)] min-w-fit ${
              activeFile?.path === file.path
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)]'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            }`}
            onClick={() => setActiveFile(file)}
          >
            <span className="text-[#519aba] text-xs font-bold">
              {file.name.endsWith('.tsx') || file.name.endsWith('.ts') ? 'TS' : 'JS'}
            </span>
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

      {/* Breadcrumbs */}
      {breadcrumbs && activeFile && (
        <div
          className="flex items-center gap-1 px-4 py-1 text-xs text-[var(--text-muted)]"
          style={{ background: 'var(--breadcrumb-bg)', borderBottom: '1px solid var(--border-color)' }}
        >
          <span>src</span>
          <span>›</span>
          <span>{activeFile.path.split('/').slice(1, -1).join(' › ') || 'root'}</span>
          <span>›</span>
          <span className="text-[var(--text-secondary)]">{activeFile.name}</span>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        {activeFile && (
          <Editor
            height="100%"
            defaultLanguage={getLanguage(activeFile.name)}
            language={getLanguage(activeFile.name)}
            value={fileContents[activeFile.path] || activeFile.content || ''}
            onChange={onEditorChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
              fontLigatures: true,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: true,
              scrollBeyondLastColumn: 5,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'off',
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
            }}
          />
        )}
      </div>
    </div>
  );
}
