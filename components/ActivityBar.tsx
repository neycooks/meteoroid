'use client';

import { FiFiles, FiSearch, FiGitBranch, FiBug, FiPackage, FiSettings, FiAccount } from 'react-icons/fi';

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
    { id: 'explorer', icon: FiFiles, label: 'Explorer' },
    { id: 'search', icon: FiSearch, label: 'Search' },
    { id: 'git', icon: FiGitBranch, label: 'Source Control' },
    { id: 'debug', icon: FiBug, label: 'Debug' },
    { id: 'extensions', icon: FiPackage, label: 'Extensions' },
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
          className={`w-12 h-12 flex items-center justify-center mb-0.5 ${
            activeActivity === id && sidebarVisible
              ? 'text-[var(--text-primary)] border-l-2 border-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
          title={label}
        >
          <Icon size={24} />
        </button>
      ))}
      <div className="flex-1" />
      <button
        className="w-12 h-12 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        title="Accounts"
      >
        <FiAccount size={24} />
      </button>
      <button
        className="w-12 h-12 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        title="Settings"
      >
        <FiSettings size={24} />
      </button>
    </div>
  );
}
