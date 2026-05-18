'use client';

import { useState } from 'react';
import { FiChevronRight, FiChevronDown, FiFile, FiFileText, FiFolder, FiFolderOpen } from 'react-icons/fi';
import type { FileNode } from './IDE';

interface SideBarProps {
  files: FileNode[];
  openFile: (file: FileNode) => void;
  activeFile: FileNode | null;
  activeActivity: string;
}

function FileTree({
  nodes,
  openFile,
  activeFile,
  depth = 0,
}: {
  nodes: FileNode[];
  openFile: (file: FileNode) => void;
  activeFile: FileNode | null;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ '/src': true, '/src/components': true });

  const toggleFolder = (path: string) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const getFileIcon = (name: string, isFolder: boolean, isOpen: boolean) => {
    if (isFolder) {
      return isOpen ? (
        <FiFolderOpen className="text-[#dcb67a]" size={16} />
      ) : (
        <FiFolder className="text-[#dcb67a]" size={16} />
      );
    }
    if (name.endsWith('.tsx') || name.endsWith('.jsx')) {
      return <span className="text-[#519aba] text-xs font-bold">TS</span>;
    }
    if (name.endsWith('.ts') || name.endsWith('.js')) {
      return <span className="text-[#519aba] text-xs font-bold">JS</span>;
    }
    if (name.endsWith('.json')) {
      return <span className="text-[#cbcb41] text-xs font-bold">{}</span>;
    }
    if (name.endsWith('.css')) {
      return <span className="text-[#56b3b3] text-xs font-bold">#</span>;
    }
    if (name.endsWith('.md')) {
      return <span className="text-[#519aba] text-xs font-bold">MD</span>;
    }
    return <FiFile className="text-[var(--text-secondary)]" size={14} />;
  };

  return (
    <>
      {nodes.map((node) => (
        <div key={node.path}>
          <div
            className={`flex items-center gap-1 py-0.5 cursor-pointer hover:bg-[var(--bg-hover)] ${
              activeFile?.path === node.path ? 'bg-[var(--bg-active)]' : ''
            }`}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => (node.type === 'folder' ? toggleFolder(node.path) : openFile(node))}
          >
            {node.type === 'folder' && (
              <span className="text-[var(--text-secondary)]">
                {expanded[node.path] ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
              </span>
            )}
            {getFileIcon(node.name, node.type === 'folder', expanded[node.path])}
            <span className="text-xs text-[var(--text-primary)] truncate">{node.name}</span>
          </div>
          {node.type === 'folder' && expanded[node.path] && node.children && (
            <FileTree
              nodes={node.children}
              openFile={openFile}
              activeFile={activeFile}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </>
  );
}

export default function SideBar({ files, openFile, activeFile, activeActivity }: SideBarProps) {
  const titles: Record<string, string> = {
    explorer: 'Explorer',
    search: 'Search',
    git: 'Source Control',
    debug: 'Run and Debug',
    extensions: 'Extensions',
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
              <div className="flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)] cursor-pointer">
                <FiChevronDown size={14} />
                <span>METEOROID-APP</span>
              </div>
            </div>
            <FileTree nodes={files} openFile={openFile} activeFile={activeFile} />
          </>
        )}
        {activeActivity === 'search' && (
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-2 py-1 text-xs bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
            />
          </div>
        )}
        {activeActivity === 'git' && (
          <div className="px-4 py-2 text-xs text-[var(--text-secondary)]">
            <p>No source control providers registered.</p>
          </div>
        )}
        {activeActivity === 'debug' && (
          <div className="px-4 py-2 text-xs text-[var(--text-secondary)]">
            <p>To customize Run and Debug create a launch.json file.</p>
          </div>
        )}
        {activeActivity === 'extensions' && (
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder="Search Extensions in Marketplace"
              className="w-full px-2 py-1 text-xs bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
