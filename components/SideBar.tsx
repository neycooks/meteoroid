'use client';

import { useState } from 'react';
import type { FileNode } from './IDE';

interface SideBarProps {
  files: FileNode[];
  openFile: (file: FileNode) => void;
  activeFile: FileNode | null;
  activeActivity: string;
  onNewFile?: (path: string) => void;
  onNewFolder?: (path: string) => void;
  onDeleteFile?: (path: string) => void;
  onRenameFile?: (oldPath: string, newName: string) => void;
}

const FileIcon = ({ name, isFolder, isOpen }: { name: string; isFolder: boolean; isOpen: boolean }) => {
  if (isFolder) {
    const color = isOpen ? '#dcb67a' : '#dcb67a';
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill={color}>
        {isOpen ? (
          <path d="M14 5H8L6 3H2C1.4 3 1 3.4 1 4V13C1 13.6 1.4 14 2 14H14C14.6 14 15 13.6 15 13V6C15 5.4 14.6 5 14 5Z"/>
        ) : (
          <path d="M14 4H8L6 2H2C1.4 2 1 2.4 1 3V12C1 12.6 1.4 13 2 13H14C14.6 13 15 12.6 15 12V5C15 4.4 14.6 4 14 4Z"/>
        )}
      </svg>
    );
  }
  if (name.endsWith('.tsx') || name.endsWith('.jsx')) {
    return <span className="text-[#519aba] text-[10px] font-bold">TS</span>;
  }
  if (name.endsWith('.ts') || name.endsWith('.js')) {
    return <span className="text-[#519aba] text-[10px] font-bold">JS</span>;
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
  if (name.endsWith('.html')) {
    return <span className="text-[#e44d26] text-[10px] font-bold">&lt;&gt;</span>;
  }
  if (name.endsWith('.py')) {
    return <span className="text-[#3572A5] text-[10px] font-bold">PY</span>;
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="var(--text-secondary)">
      <path d="M12 1H3C2.4 1 2 1.4 2 2V14C2 14.6 2.4 15 3 15H13C13.6 15 14 14.6 14 14V4L12 1ZM13 14H3V2H11V5H13V14Z"/>
    </svg>
  );
};

function FileTree({
  nodes,
  openFile,
  activeFile,
  depth = 0,
  onDeleteFile,
  onRenameFile,
}: {
  nodes: FileNode[];
  openFile: (file: FileNode) => void;
  activeFile: FileNode | null;
  depth?: number;
  onDeleteFile?: (path: string) => void;
  onRenameFile?: (oldPath: string, newName: string) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ '/src': true, '/src/components': true });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: FileNode } | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const toggleFolder = (path: string) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, node });
  };

  const startRename = (node: FileNode) => {
    setRenaming(node.path);
    setRenameValue(node.name);
    setContextMenu(null);
  };

  const finishRename = () => {
    if (renaming && renameValue && onRenameFile) {
      onRenameFile(renaming, renameValue);
    }
    setRenaming(null);
    setRenameValue('');
  };

  return (
    <>
      {nodes.map((node) => (
        <div key={node.path}>
          <div
            className={`flex items-center gap-1 py-0.5 cursor-pointer hover:bg-[var(--bg-hover)] group ${
              activeFile?.path === node.path ? 'bg-[var(--bg-active)]' : ''
            }`}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => (node.type === 'folder' ? toggleFolder(node.path) : openFile(node))}
            onContextMenu={(e) => handleContextMenu(e, node)}
          >
            {node.type === 'folder' && (
              <span className="text-[var(--text-secondary)] w-4 h-4 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  {expanded[node.path] ? (
                    <path d="M7.5 10L3 5h9l-4.5 5z"/>
                  ) : (
                    <path d="M6 7.5L10 3H1l4.5 4.5z"/>
                  )}
                </svg>
              </span>
            )}
            <FileIcon name={node.name} isFolder={node.type === 'folder'} isOpen={expanded[node.path]} />
            {renaming === node.path ? (
              <input
                className="flex-1 text-xs bg-[var(--bg-input)] text-[var(--text-primary)] px-1 outline-none border border-[var(--accent)]"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={finishRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') finishRename();
                  if (e.key === 'Escape') { setRenaming(null); }
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-xs text-[var(--text-primary)] truncate flex-1">{node.name}</span>
            )}
            {node.type === 'file' && (
              <button
                className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center hover:bg-[var(--bg-active)] text-[var(--text-muted)]"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDeleteFile) onDeleteFile(node.path);
                }}
              >
                ×
              </button>
            )}
          </div>
          {node.type === 'folder' && expanded[node.path] && node.children && (
            <FileTree
              nodes={node.children}
              openFile={openFile}
              activeFile={activeFile}
              depth={depth + 1}
              onDeleteFile={onDeleteFile}
              onRenameFile={onRenameFile}
            />
          )}
        </div>
      ))}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed z-50 py-1 min-w-[200px] shadow-lg"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
            }}
          >
            {contextMenu.node.type === 'folder' && (
              <>
                <button
                  className="w-full px-4 py-1.5 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-active)] text-left"
                  onClick={() => { setContextMenu(null); }}
                >
                  New File
                </button>
                <button
                  className="w-full px-4 py-1.5 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-active)] text-left"
                  onClick={() => { setContextMenu(null); }}
                >
                  New Folder
                </button>
                <div className="my-1 border-t border-[var(--border-color)]" />
              </>
            )}
            <button
              className="w-full px-4 py-1.5 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-active)] text-left"
              onClick={() => startRename(contextMenu.node)}
            >
              Rename
            </button>
            <button
              className="w-full px-4 py-1.5 text-xs text-[var(--text-primary)] hover:bg-[var(--bg-active)] text-left"
              onClick={() => {
                if (onDeleteFile) onDeleteFile(contextMenu.node.path);
                setContextMenu(null);
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default function SideBar({
  files,
  openFile,
  activeFile,
  activeActivity,
}: SideBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ file: string; line: number; content: string }>>([]);

  const titles: Record<string, string> = {
    explorer: 'Explorer',
    search: 'Search',
    git: 'Source Control',
    debug: 'Run and Debug',
    extensions: 'Extensions',
  };

  const performSearch = (query: string) => {
    if (!query) { setSearchResults([]); return; }
    const results: Array<{ file: string; line: number; content: string }> = [];
    const searchInFiles = (nodes: FileNode[]) => {
      nodes.forEach((node) => {
        if (node.type === 'file' && node.content) {
          const lines = node.content.split('\n');
          lines.forEach((line, idx) => {
            if (line.toLowerCase().includes(query.toLowerCase())) {
              results.push({ file: node.path, line: idx + 1, content: line.trim() });
            }
          });
        }
        if (node.children) searchInFiles(node.children);
      });
    };
    searchInFiles(files);
    setSearchResults(results);
  };

  return (
    <div
      className="flex flex-col w-64"
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border-color)' }}
    >
      <div
        className="flex items-center justify-between h-9 px-5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        {titles[activeActivity] || 'Explorer'}
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {activeActivity === 'explorer' && (
          <>
            <div className="px-3 py-1">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] cursor-pointer">
                <span>METEOROID-APP</span>
                <div className="flex gap-1">
                  <button className="w-5 h-5 flex items-center justify-center hover:bg-[var(--bg-hover)] rounded" title="New File">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M14 1H3C2.4 1 2 1.4 2 2V14C2 14.6 2.4 15 3 15H13C13.6 15 14 14.6 14 14V4L12 1ZM13 14H3V2H11V5H13V14Z"/></svg>
                  </button>
                  <button className="w-5 h-5 flex items-center justify-center hover:bg-[var(--bg-hover)] rounded" title="New Folder">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M14 4H8L6 2H2C1.4 2 1 2.4 1 3V12C1 12.6 1.4 13 2 13H14C14.6 13 15 12.6 15 12V5C15 4.4 14.6 4 14 4Z"/></svg>
                  </button>
                  <button className="w-5 h-5 flex items-center justify-center hover:bg-[var(--bg-hover)] rounded" title="Refresh">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 8A5.5 5.5 0 003.6 4.2L1 6.8V2h4.8L3.5 4.3A7.5 7.5 0 0115.5 8H13.5zM2.5 8A5.5 5.5 0 0012.4 11.8L15 9.2V14h-4.8l2.3-2.3A7.5 7.5 0 01.5 8h2z"/></svg>
                  </button>
                  <button className="w-5 h-5 flex items-center justify-center hover:bg-[var(--bg-hover)] rounded" title="Collapse Folders">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M14 5H8L6 3H2C1.4 3 1 3.4 1 4V13C1 13.6 1.4 14 2 14H14C14.6 14 15 13.6 15 13V6C15 5.4 14.6 5 14 5Z"/></svg>
                  </button>
                </div>
              </div>
            </div>
            <FileTree nodes={files} openFile={openFile} activeFile={activeFile} />
          </>
        )}
        {activeActivity === 'search' && (
          <div className="px-4 py-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); performSearch(e.target.value); }}
                className="w-full px-2 py-1 text-xs bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] pr-6"
              />
              {searchQuery && (
                <button
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                >
                  ×
                </button>
              )}
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-[var(--text-secondary)] mb-1">
                  {searchResults.length} results in {new Set(searchResults.map(r => r.file)).size} files
                </div>
                {searchResults.map((result, i) => (
                  <div key={i} className="px-2 py-0.5 hover:bg-[var(--bg-hover)] cursor-pointer">
                    <div className="text-xs text-[var(--text-secondary)]">{result.file}:{result.line}</div>
                    <div className="text-xs text-[var(--text-primary)] truncate">{result.content}</div>
                  </div>
                ))}
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <div className="text-xs text-[var(--text-muted)] mt-2 px-2">No results found.</div>
            )}
          </div>
        )}
        {activeActivity === 'git' && (
          <div className="px-4 py-2">
            <div className="text-xs text-[var(--text-secondary)] mb-3">No changes detected in the working tree.</div>
            <div className="border-t border-[var(--border-color)] pt-3">
              <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2">Commits</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-[10px] text-white">N</div>
                  <div>
                    <div className="text-xs text-[var(--text-primary)]">Initial commit</div>
                    <div className="text-[10px] text-[var(--text-muted)]">main • just now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeActivity === 'debug' && (
          <div className="px-4 py-2">
            <div className="text-xs text-[var(--text-secondary)] mb-3">To customize Run and Debug create a launch.json file.</div>
            <button className="w-full px-3 py-1.5 text-xs bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded">
              Run and Debug
            </button>
            <div className="mt-3 border-t border-[var(--border-color)] pt-3">
              <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2">Breakpoints</div>
              <div className="text-xs text-[var(--text-muted)]">No breakpoints set.</div>
            </div>
          </div>
        )}
        {activeActivity === 'extensions' && (
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder="Search Extensions in Marketplace"
              className="w-full px-2 py-1 text-xs bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
            />
            <div className="mt-3 space-y-2">
              {[
                { name: 'ES7+ React Snippets', author: 'dsznajder', installs: '12M', desc: 'Extensions for React, React-Native' },
                { name: 'Prettier', author: 'Prettier', installs: '42M', desc: 'Code formatter using prettier' },
                { name: 'GitLens', author: 'GitKraken', installs: '28M', desc: 'Supercharge Git within VS Code' },
                { name: 'Auto Rename Tag', author: 'formulahendry', installs: '15M', desc: 'Auto rename paired HTML/XML tag' },
                { name: 'Thunder Client', author: 'Thunder Client', installs: '5M', desc: 'Lightweight Rest API Client' },
              ].map((ext, i) => (
                <div key={i} className="flex gap-2 p-2 hover:bg-[var(--bg-hover)] cursor-pointer">
                  <div className="w-10 h-10 bg-[var(--bg-input)] flex items-center justify-center text-[var(--text-secondary)] text-xs font-bold">
                    {ext.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[var(--text-primary)] font-medium">{ext.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{ext.desc}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{ext.author} • {ext.installs} installs</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
