export type ViewType = "tabs" | "sessions";

interface HeaderProps {
  tabCount: number;
  groupCount: number;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export function Header({
  tabCount,
  groupCount,
  view,
  onViewChange,
  darkMode,
  onToggleTheme,
}: HeaderProps) {
  return (
    <div className="border-b border-surface-200 bg-surface-0 px-4 pb-3 pt-4 dark:border-surface-700 dark:bg-surface-900">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <h1 className="text-base font-bold tracking-tight text-surface-900 dark:text-white">
            TabFlow
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="rounded-full bg-surface-100 px-2.5 py-0.5 text-[11px] font-bold tabular-nums text-surface-600 dark:bg-surface-800 dark:text-surface-300">
              {tabCount} tabs
            </span>
            {groupCount > 0 && (
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold tabular-nums text-brand-600 dark:bg-brand-900 dark:text-brand-200">
                {groupCount} groups
              </span>
            )}
          </div>
          <button
            onClick={onToggleTheme}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-800 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-white"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-surface-100 p-1 dark:bg-surface-800">
        <button
          onClick={() => onViewChange("tabs")}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
            view === "tabs"
              ? "bg-brand-600 text-white"
              : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
          }`}
        >
          Tabs & Groups
        </button>
        <button
          onClick={() => onViewChange("sessions")}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
            view === "sessions"
              ? "bg-brand-600 text-white"
              : "text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white"
          }`}
        >
          Saved Sessions
        </button>
      </div>
    </div>
  );
}
