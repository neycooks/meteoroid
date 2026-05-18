'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Code2,
  Search,
  FileText,
  FolderTree,
  GitBranch,
  Bug,
  Puzzle,
  Settings,
  User,
  ChevronDown,
  X,
  Minus,
  Square,
  PanelLeft,
  Terminal,
  LayoutGrid,
  Type,
  TypeDecrease,
  Columns,
} from 'lucide-react';

interface TitleBarProps {
  activeMenu: string | null;
  setActiveMenu: (menu: string | null) => void;
  onCommand: () => void;
}

const menus = {
  File: ['New File', 'New Window', 'Open File...', 'Open Folder...', 'Save', 'Save As...', 'Auto Save', 'Preferences', 'Close Editor', 'Close Window'],
  Edit: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Find', 'Replace', 'Find in Files', 'Replace in Files'],
  View: ['Command Palette', 'Open View...', 'Appearance', 'Editor Layout', 'Sidebar', 'Panel', 'Terminal', 'Problems', 'Output', 'Debug Console'],
  Go: ['Go to File...', 'Go to Line/Column...', 'Go to Symbol...', 'Go to Definition', 'Go to Declaration', 'Go to References', 'Go to Implementation', 'Back', 'Forward'],
  Run: ['Start Debugging', 'Run Without Debugging', 'Stop Debugging', 'Step Over', 'Step Into', 'Step Out', 'Restart Debugging'],
  Terminal: ['New Terminal', 'Split Terminal', 'Run Task...', 'Run Build Task', 'Configure Default Build Task'],
  Help: ['Welcome', 'Show All Commands', 'Documentation', 'Release Notes', 'Privacy Statement', 'Report Issue', 'Check for Updates'],
};

export default function TitleBar({ activeMenu, setActiveMenu, onCommand }: TitleBarProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setActiveMenu]);

  const handleMenuClick = (menu: string) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
    }
  };

  const handleMenuAction = (action: string) => {
    setActiveMenu(null);
    switch (action) {
      case 'Command Palette':
      case 'Show All Commands':
        onCommand();
        break;
      case 'Sidebar':
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', ctrlKey: true }));
        break;
      case 'Panel':
      case 'Terminal':
        window.dispatchEvent(new KeyboardEvent('keydown', { key: '`', ctrlKey: true }));
        break;
    }
  };

  return (
    <div
      className="flex h-9 items-center justify-between select-none"
      style={{ background: 'var(--titlebar-bg)', borderBottom: '1px solid var(--border-color)' }}
    >
      <div className="flex items-center gap-2 px-3">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 flex items-center justify-center">
            <Code2 size={18} className="text-[var(--accent)]" />
          </div>
        </div>
        <div className="flex items-center gap-0.5 ml-2" ref={menuRef}>
          {Object.keys(menus).map((menu) => (
            <div key={menu} className="relative">
              <button
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  activeMenu === menu
                    ? 'bg-[var(--bg-active)] text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                }`}
                onClick={() => handleMenuClick(menu)}
              >
                {menu}
              </button>
              {activeMenu === menu && (
                <div
                  className="absolute top-full left-0 mt-1 py-1.5 min-w-[240px] z-50 shadow-xl"
                  style={{
                    background: 'var(--dropdown-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  {menus[menu as keyof typeof menus].map((action, i) => (
                    <button
                      key={i}
                      className="w-full px-3 py-1.5 text-xs text-left text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-white transition-colors flex items-center justify-between"
                      onClick={() => handleMenuAction(action)}
                    >
                      <span>{action}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex justify-center">
        <button
          onClick={onCommand}
          className="flex items-center gap-2 px-4 py-1 text-xs text-[var(--text-muted)] hover:bg-[var(--bg-hover)] rounded-md transition-colors"
        >
          <Search size={12} />
          <span>Meteoroid — Code Editor</span>
        </button>
      </div>

      <div className="flex items-center">
        <button className="w-11 h-9 flex items-center justify-center hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors">
          <Minus size={14} />
        </button>
        <button className="w-11 h-9 flex items-center justify-center hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors">
          <Square size={12} strokeWidth={1.5} />
        </button>
        <button className="w-11 h-9 flex items-center justify-center hover:bg-red-600 hover:text-white text-[var(--text-secondary)] transition-colors">
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
