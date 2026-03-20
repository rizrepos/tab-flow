import { useEffect, useRef } from "react";
import { SavedSession, SavedGroup, SavedTab, ChromeGroupColor } from "@/types";
import { NavItem } from "@/hooks/useSessionNav";
import { GROUP_COLOR_MAP } from "./ChromeGroupColors";

interface SessionListProps {
  flatList: NavItem[];
  activeIndex: number;
  expandedSessions: Set<string>;
  expandedGroups: Set<string>;
  onToggleSession: (id: string) => void;
  onToggleGroup: (id: string) => void;
  onRestoreSession: (session: SavedSession) => void;
  onRestoreGroup: (group: SavedGroup) => void;
  onOpenTab: (tab: SavedTab) => void;
  onDelete: (id: string) => void;
}

const SESSION_DOT: Record<string, string> = {
  indigo: "bg-indigo-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
  cyan: "bg-cyan-500",
  orange: "bg-orange-500",
};

export function SessionList({
  flatList,
  activeIndex,
  expandedSessions,
  expandedGroups,
  onToggleSession,
  onToggleGroup,
  onRestoreSession,
  onRestoreGroup,
  onOpenTab,
  onDelete,
}: SessionListProps) {
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeIndex]);

  return (
    <div className="space-y-1">
      {flatList.map((item, i) => {
        const isActive = activeIndex === i;
        const ref = isActive ? activeRef : undefined;

        if (item.type === "session") {
          return (
            <SessionRow
              key={`s-${item.id}`}
              ref={ref}
              session={item.session}
              expanded={expandedSessions.has(item.id)}
              isActive={isActive}
              onToggle={() => onToggleSession(item.id)}
              onRestore={() => onRestoreSession(item.session)}
              onDelete={() => onDelete(item.id)}
            />
          );
        }

        if (item.type === "group" && item.group) {
          return (
            <GroupRow
              key={`g-${item.id}`}
              ref={ref}
              group={item.group}
              expanded={expandedGroups.has(item.id)}
              isActive={isActive}
              onToggle={() => onToggleGroup(item.id)}
              onRestore={() => onRestoreGroup(item.group!)}
            />
          );
        }

        if (item.type === "tab" && item.tab) {
          return (
            <TabRow
              key={`t-${item.id}`}
              ref={ref}
              tab={item.tab}
              isActive={isActive}
              onOpen={() => onOpenTab(item.tab!)}
            />
          );
        }

        return null;
      })}
    </div>
  );
}

// --- Session Row ---
import { forwardRef } from "react";

const SessionRow = forwardRef<
  HTMLDivElement,
  {
    session: SavedSession;
    expanded: boolean;
    isActive: boolean;
    onToggle: () => void;
    onRestore: () => void;
    onDelete: () => void;
  }
>(({ session, expanded, isActive, onToggle, onRestore, onDelete }, ref) => {
  const totalTabs = session.groups.reduce((sum, g) => sum + g.tabs.length, 0);
  const dot = SESSION_DOT[session.color] ?? "bg-surface-500";
  const timeAgo = getTimeAgo(session.updatedAt);

  return (
    <div
      ref={ref}
      className={`group rounded-lg border-2 px-3 py-2.5 transition-all ${
        isActive
          ? "border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/40"
          : "border-surface-200 bg-surface-0 hover:border-surface-300 dark:border-surface-700 dark:bg-surface-900 dark:hover:border-surface-600"
      }`}
    >
      <div className="flex items-center gap-2">
        <button onClick={onToggle} className="flex items-center gap-2">
          <svg
            className={`h-4 w-4 text-surface-600 transition-transform dark:text-surface-300 ${expanded ? "rotate-90" : ""}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
          </svg>
          <div className={`h-3 w-3 rounded-full ${dot}`} />
          <span className="text-sm font-bold text-surface-900 dark:text-white">
            {session.name}
          </span>
        </button>
        <span className="ml-1 text-[11px] font-semibold text-surface-600 dark:text-surface-300">
          {totalTabs} tabs · {session.groups.length} groups
        </span>
        <span className="ml-auto text-[10px] font-medium text-surface-500 dark:text-surface-400">
          {timeAgo}
        </span>
        <button
          onClick={onRestore}
          className="rounded bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white transition-colors hover:bg-brand-700"
        >
          Restore
        </button>
        <button
          onClick={onDelete}
          className="rounded p-0.5 text-surface-400 opacity-0 transition-all hover:text-red-600 group-hover:opacity-100 dark:text-surface-500 dark:hover:text-red-400"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
});

// --- Group Row ---
const GroupRow = forwardRef<
  HTMLDivElement,
  {
    group: SavedGroup;
    expanded: boolean;
    isActive: boolean;
    onToggle: () => void;
    onRestore: () => void;
  }
>(({ group, expanded, isActive, onToggle, onRestore }, ref) => {
  const colors = GROUP_COLOR_MAP[group.color as ChromeGroupColor] ?? GROUP_COLOR_MAP.grey;

  return (
    <div
      ref={ref}
      className={`group ml-4 rounded-lg border px-3 py-2 transition-all ${
        isActive
          ? "border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/40"
          : `border-l-2 border-r-0 border-t-0 border-b-0 ${colors.border} bg-surface-0 hover:bg-surface-50 dark:bg-surface-900 dark:hover:bg-surface-800/80`
      }`}
    >
      <div className="flex items-center gap-2">
        <button onClick={onToggle} className="flex items-center gap-2">
          <svg
            className={`h-3.5 w-3.5 text-surface-600 transition-transform dark:text-surface-300 ${expanded ? "rotate-90" : ""}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
          </svg>
          <div className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
          <span className={`text-xs font-bold ${colors.text}`}>
            {group.title || "Ungrouped"}
          </span>
        </button>
        <span className="text-[11px] font-semibold text-surface-600 dark:text-surface-300">
          ({group.tabs.length})
        </span>
        <button
          onClick={onRestore}
          className="ml-auto rounded bg-surface-200 px-2 py-0.5 text-[10px] font-bold text-surface-700 transition-colors hover:bg-surface-300 dark:bg-surface-700 dark:text-surface-200 dark:hover:bg-surface-600"
        >
          Open Group
        </button>
      </div>
    </div>
  );
});

// --- Tab Row ---
const TabRow = forwardRef<
  HTMLDivElement,
  {
    tab: SavedTab;
    isActive: boolean;
    onOpen: () => void;
  }
>(({ tab, isActive, onOpen }, ref) => {
  const domain = (() => {
    try { return new URL(tab.url).hostname.replace("www.", ""); }
    catch { return ""; }
  })();

  return (
    <div
      ref={ref}
      onClick={onOpen}
      className={`ml-10 flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-1.5 transition-all ${
        isActive
          ? "border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/40"
          : "border-surface-200 bg-surface-0 hover:border-surface-300 dark:border-surface-700 dark:bg-surface-900 dark:hover:border-surface-600"
      }`}
    >
      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-surface-200 dark:bg-surface-700">
        {tab.favIconUrl ? (
          <img src={tab.favIconUrl} alt="" className="h-3 w-3 rounded-sm" />
        ) : (
          <svg className="h-2.5 w-2.5 text-surface-500 dark:text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-semibold text-surface-800 dark:text-surface-200">
          {tab.title}
        </p>
        <p className="truncate text-[10px] font-medium text-surface-500 dark:text-surface-400">
          {domain}
        </p>
      </div>
      <svg className={`h-3 w-3 flex-shrink-0 transition-colors ${isActive ? "text-brand-600 dark:text-brand-400" : "text-surface-400 dark:text-surface-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </div>
  );
});

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
