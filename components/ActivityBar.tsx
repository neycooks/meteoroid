'use client';

import {
  Files,
  Search,
  GitBranch,
  Bug,
  Puzzle,
  Settings,
  User,
} from 'lucide-react';

interface ActivityBarProps {
  activeActivity: string;
  setActiveActivity: (activity: string) => void;
  sidebarVisible: boolean;
  setSidebarVisible: (visible: boolean) => void;
}

export default function ActivityBar({
  activeActivity,
  setActiveActivity,
  sidebarVisible,
  setSidebarVisible,
}: ActivityBarProps) {
  const activities = [
    { id: 'explorer', icon: Files, label: 'Explorer' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'git', icon: GitBranch, label: 'Source Control' },
    { id: 'debug', icon: Bug, label: 'Debug' },
    { id: 'extensions', icon: Puzzle, label: 'Extensions' },
  ];

  const toggleActivity = (id: string) => {
    if (activeActivity === id && sidebarVisible) {
      setSidebarVisible(false);
    } else {
      setActiveActivity(id);
      setSidebarVisible(true);
    }
  };

  return (
    <div
      className="flex flex-col items-center w-12 py-1"
      style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }}
    >
      {activities.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => toggleActivity(id)}
          className={`w-12 h-12 flex items-center justify-center mb-0.5 transition-colors ${
            activeActivity === id && sidebarVisible
              ? 'text-[var(--text-primary)] border-l-2 border-[var(--accent)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
          title={label}
        >
          <Icon size={22} strokeWidth={1.5} />
        </button>
      ))}
      <div className="flex-1" />
      <button
        className="w-12 h-12 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        title="Accounts"
      >
        <User size={22} strokeWidth={1.5} />
      </button>
      <button
        className="w-12 h-12 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        title="Settings"
      >
        <Settings size={22} strokeWidth={1.5} />
      </button>
    </div>
  );
}
