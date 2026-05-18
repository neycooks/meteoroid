'use client';

import { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  FileCode,
  FileJson,
  FileType,
  FileText,
  Plus,
  FolderPlus,
  RefreshCw,
  Collapse,
  Search,
  X,
  ExternalLink,
  Download,
  Star,
} from 'lucide-react';
import type { FileNode } from './IDE';

interface SideBarProps {
  files: FileNode[];
  openFile: (file: FileNode) => void;
  activeFile: FileNode | null;
  activeActivity: string;
}

interface Extension {
  id: string;
  name: string;
  displayName: string;
  publisher: { displayName: string };
  shortDescription: string;
  statistics: { statisticName: string; value: number }[];
  icon: { assetType: string; source: string }[];
  categories: string[];
}

const FileIcon = ({ name, isFolder, isOpen }: { name: string; isFolder: boolean; isOpen: boolean }) => {
  if (isFolder) {
    return isOpen ? <FolderOpen size={16} className="text-[#dcb67a]" /> : <Folder size={16} className="text-[#dcb67a]" />;
  }
  if (name.endsWith('.tsx') || name.endsWith('.jsx')) {
    return <FileCode size={14} className="text-[#519aba]" />;
  }
  if (name.endsWith('.ts') || name.endsWith('.js')) {
    return <FileCode size={14} className="text-[#519aba]" />;
  }
  if (name.endsWith('.json')) {
    return <FileJson size={14} className="text-[#cbcb41]" />;
  }
  if (name.endsWith('.css')) {
    return <FileType size={14} className="text-[#56b3b3]" />;
  }
  if (name.endsWith('.md')) {
    return <FileText size={14} className="text-[#519aba]" />;
  }
  if (name.endsWith('.html')) {
    return <FileCode size={14} className="text-[#e44d26]" />;
  }
  if (name.endsWith('.py')) {
    return <FileCode size={14} className="text-[#3572A5]" />;
  }
  return <File size={14} className="text-[var(--text-secondary)]" />;
};

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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ '/src': true, '/src/components': true, '/src/utils': true, '/src/styles': true });

  const toggleFolder = (path: string) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <>
      {nodes.map((node) => (
        <div key={node.path}>
          <div
            className={`flex items-center gap-1.5 py-0.5 cursor-pointer group transition-colors ${
              activeFile?.path === node.path
                ? 'bg-[var(--bg-active)] text-[var(--text-primary)]'
                : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]'
            }`}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => (node.type === 'folder' ? toggleFolder(node.path) : openFile(node))}
          >
            {node.type === 'folder' && (
              <span className="w-4 h-4 flex items-center justify-center">
                {expanded[node.path] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            )}
            <FileIcon name={node.name} isFolder={node.type === 'folder'} isOpen={expanded[node.path]} />
            <span className="text-xs truncate flex-1">{node.name}</span>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ file: string; line: number; content: string }>>([]);
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loadingExtensions, setLoadingExtensions] = useState(false);

  const titles: Record<string, string> = {
    explorer: 'Explorer',
    search: 'Search',
    git: 'Source Control',
    debug: 'Run and Debug',
    extensions: 'Extensions',
  };

  useEffect(() => {
    if (activeActivity === 'extensions') {
      setLoadingExtensions(true);
      fetch('https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json;api-version=3.0-preview.1',
        },
        body: JSON.stringify({
          filters: [{ criteria: [{ filterType: 8, value: 'Microsoft.VisualStudio.Code' }], pageSize: 20 }],
          flags: 0x91e,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.results?.[0]?.extensions) {
            setExtensions(data.results[0].extensions);
          }
          setLoadingExtensions(false);
        })
        .catch(() => setLoadingExtensions(false));
    }
  }, [activeActivity]);

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

  const getInstalls = (stats: Extension['statistics']) => {
    const installStat = stats.find((s) => s.statisticName === 'install');
    if (!installStat) return '0';
    const val = installStat.value;
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return val.toString();
  };

  return (
    <div
      className="flex flex-col w-64"
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border-color)' }}
    >
      <div
        className="flex items-center justify-between h-9 px-4 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <span>{titles[activeActivity] || 'Explorer'}</span>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {activeActivity === 'explorer' && (
          <>
            <div className="px-3 py-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--text-secondary)]">
                <span className="cursor-pointer hover:text-[var(--text-primary)]">METEOROID</span>
                <div className="flex gap-0.5">
                  <button className="w-5 h-5 flex items-center justify-center hover:bg-[var(--bg-hover)] rounded transition-colors" title="New File">
                    <Plus size={14} />
                  </button>
                  <button className="w-5 h-5 flex items-center justify-center hover:bg-[var(--bg-hover)] rounded transition-colors" title="New Folder">
                    <FolderPlus size={14} />
                  </button>
                  <button className="w-5 h-5 flex items-center justify-center hover:bg-[var(--bg-hover)] rounded transition-colors" title="Refresh">
                    <RefreshCw size={12} />
                  </button>
                  <button className="w-5 h-5 flex items-center justify-center hover:bg-[var(--bg-hover)] rounded transition-colors" title="Collapse">
                    <Collapse size={14} />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-1">
              <FileTree nodes={files} openFile={openFile} activeFile={activeFile} />
            </div>
          </>
        )}
        {activeActivity === 'search' && (
          <div className="px-3 py-2">
            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search in files..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); performSearch(e.target.value); }}
                className="w-full pl-7 pr-7 py-1.5 text-xs bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] rounded-md transition-colors"
              />
              {searchQuery && (
                <button
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2">
                <div className="text-[11px] text-[var(--text-secondary)] mb-1 px-1">
                  {searchResults.length} results in {new Set(searchResults.map((r) => r.file)).size} files
                </div>
                {searchResults.slice(0, 50).map((result, i) => (
                  <div key={i} className="px-2 py-1 hover:bg-[var(--bg-hover)] cursor-pointer rounded-md transition-colors">
                    <div className="text-[11px] text-[var(--text-muted)]">{result.file}:{result.line}</div>
                    <div className="text-xs text-[var(--text-primary)] truncate">{result.content}</div>
                  </div>
                ))}
              </div>
            )}
            {searchQuery && searchResults.length === 0 && (
              <div className="text-xs text-[var(--text-muted)] mt-3 px-1">No results found.</div>
            )}
          </div>
        )}
        {activeActivity === 'git' && (
          <div className="px-3 py-2">
            <div className="text-xs text-[var(--text-secondary)] mb-3">No changes detected.</div>
            <div className="border-t border-[var(--border-color)] pt-3">
              <div className="text-[11px] font-semibold text-[var(--text-secondary)] mb-2">Timeline</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-[10px] font-medium text-white">N</div>
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
          <div className="px-3 py-2">
            <div className="text-xs text-[var(--text-secondary)] mb-3">Run and Debug</div>
            <button className="w-full px-3 py-1.5 text-xs bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] rounded-md transition-colors font-medium">
              Run and Debug
            </button>
            <div className="mt-3 border-t border-[var(--border-color)] pt-3">
              <div className="text-[11px] font-semibold text-[var(--text-secondary)] mb-2">Breakpoints</div>
              <div className="text-xs text-[var(--text-muted)]">No breakpoints set.</div>
            </div>
          </div>
        )}
        {activeActivity === 'extensions' && (
          <div className="px-3 py-2">
            <div className="relative mb-3">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search Extensions in Marketplace"
                className="w-full pl-7 pr-2 py-1.5 text-xs bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] rounded-md transition-colors"
              />
            </div>
            {loadingExtensions ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw size={20} className="text-[var(--text-muted)] animate-spin" />
              </div>
            ) : (
              <div className="space-y-1">
                {extensions.slice(0, 15).map((ext) => (
                  <div
                    key={ext.id}
                    className="flex gap-2.5 p-2 hover:bg-[var(--bg-hover)] cursor-pointer rounded-md transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-md bg-[var(--bg-input)] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {ext.icon?.[0]?.source ? (
                        <img src={ext.icon[0].source} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[var(--text-secondary)] text-xs font-bold">{ext.displayName[0]}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[var(--text-primary)] font-medium truncate">{ext.displayName}</div>
                      <div className="text-[10px] text-[var(--text-muted)] truncate">{ext.shortDescription}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[var(--text-muted)]">{ext.publisher.displayName}</span>
                        <span className="flex items-center gap-0.5 text-[10px] text-[var(--text-muted)]">
                          <Download size={8} />
                          {getInstalls(ext.statistics)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
