'use client';

import { useState } from 'react';

interface ActivityBarProps {
  activeActivity: string;
  setActiveActivity: (activity: string) => void;
  sidebarVisible: boolean;
  setSidebarVisible: (visible: boolean) => void;
}

const Icons = {
  Explorer: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 3h7l2 2h9v14H3V3z"/>
      <path d="M3 9h18"/>
    </svg>
  ),
  Search: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7"/>
      <path d="M16 16l5 5"/>
    </svg>
  ),
  Git: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="6" r="3"/>
      <circle cx="12" cy="18" r="3"/>
      <path d="M12 9v6"/>
      <path d="M12 9c0 2-3 2-3 4"/>
    </svg>
  ),
  Debug: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3L4 9v12h16V9l-8-6z"/>
      <path d="M9 12l6 4-6 4v-8z" fill="currentColor"/>
    </svg>
  ),
  Extensions: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Account: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>
    </svg>
  ),
  Settings: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
    </svg>
  ),
};

export default function ActivityBar({
  activeActivity,
  setActiveActivity,
  sidebarVisible,
  setSidebarVisible,
}: ActivityBarProps) {
  const activities = [
    { id: 'explorer', icon: Icons.Explorer, label: 'Explorer' },
    { id: 'search', icon: Icons.Search, label: 'Search' },
    { id: 'git', icon: Icons.Git, label: 'Source Control' },
    { id: 'debug', icon: Icons.Debug, label: 'Debug' },
    { id: 'extensions', icon: Icons.Extensions, label: 'Extensions' },
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
          <Icon />
        </button>
      ))}
      <div className="flex-1" />
      <button
        className="w-12 h-12 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        title="Accounts"
      >
        <Icons.Account />
      </button>
      <button
        className="w-12 h-12 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        title="Settings"
      >
        <Icons.Settings />
      </button>
    </div>
  );
}
