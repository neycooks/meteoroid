'use client';

export default function TitleBar() {
  return (
    <div
      className="flex h-8 items-center justify-between select-none"
      style={{ background: 'var(--titlebar-bg)', borderBottom: '1px solid var(--border-color)' }}
    >
      <div className="flex items-center gap-3 px-3">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M13.5 4.5L8 1.5L2.5 4.5L8 7.5L13.5 4.5Z"
            fill="var(--accent)"
          />
          <path
            d="M2.5 4.5V11.5L8 14.5V7.5L2.5 4.5Z"
            fill="var(--text-secondary)"
          />
          <path
            d="M8 7.5V14.5L13.5 11.5V4.5L8 7.5Z"
            fill="var(--text-primary)"
          />
        </svg>
        <span className="text-xs text-[var(--text-secondary)]">Meteoroid</span>
        <div className="flex gap-4 ml-4">
          <span className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">File</span>
          <span className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">Edit</span>
          <span className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">View</span>
          <span className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">Go</span>
          <span className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">Run</span>
          <span className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">Terminal</span>
          <span className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">Help</span>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <span className="text-xs text-[var(--text-muted)]">Meteoroid - Code Editor</span>
      </div>
      <div className="flex items-center">
        <button className="w-12 h-8 flex items-center justify-center hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]">
          <svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1" fill="currentColor"/></svg>
        </button>
        <button className="w-12 h-8 flex items-center justify-center hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="0.5" y="0.5" width="9" height="9"/>
          </svg>
        </button>
        <button className="w-12 h-8 flex items-center justify-center hover:bg-red-600 text-[var(--text-secondary)]">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
