import { useState } from "react";
import { SavedSession, SavedGroup, SavedTab, ChromeGroupColor } from "@/types";
import { GROUP_COLOR_MAP } from "./ChromeGroupColors";

interface SessionCardProps {
  session: SavedSession;
  onRestoreSession: (session: SavedSession) => void;
  onRestoreGroup: (group: SavedGroup) => void;
  onOpenTab: (tab: SavedTab) => void;
  onDelete: (id: string) => void;
  index: number;
}

const SESSION_COLORS: Record<string, string> = {
  indigo: "bg-indigo-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
  cyan: "bg-cyan-500",
  orange: "bg-orange-500",
};

export function SessionCard({
  session,
  onRestoreSession,
  onRestoreGroup,
  onOpenTab,
  onDelete,
  index,
}: SessionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const totalTabs = session.groups.reduce((sum, g) => sum + g.tabs.length, 0);
  const dotColor = SESSION_COLORS[session.color] ?? "bg-surface-500";
  const timeAgo = getTimeAgo(session.updatedAt);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  return (
    <div
      style={{ animationDelay: `${index * 50}ms` }}
      className="stagger-fade-in overflow-hidden rounded-xl border-2 border-surface-200 bg-surface-0 transition-all hover:border-surface-300 hover:shadow-lg hover:shadow-surface-900/5 dark:border-surface-700 dark:bg-surface-900 dark:hover:border-surface-600 dark:hover:shadow-surface-950/30"
    >
      {/* Header */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2.5 text-left"
          >
            <svg
              className={`h-4 w-4 text-surface-500 transition-transform dark:text-surface-400 ${expanded ? "rotate-90" : ""}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
            <div className={`h-3.5 w-3.5 rounded-full ${dotColor}`} />
            <h3 className="text-sm font-bold text-surface-900 dark:text-white">
              {session.name}
            </h3>
          </button>
          <button
            onClick={() => onDelete(session.id)}
            className="rounded p-1 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-surface-500 dark:hover:bg-red-950 dark:hover:text-red-400"
            title="Delete session"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div className="ml-9 flex items-center gap-3">
          <span className="text-[12px] font-semibold text-surface-600 dark:text-surface-300">
            {totalTabs} tab{totalTabs !== 1 ? "s" : ""}
          </span>
          <span className="text-surface-300 dark:text-surface-600">|</span>
          <span className="text-[12px] font-semibold text-surface-600 dark:text-surface-300">
            {session.groups.length} group{session.groups.length !== 1 ? "s" : ""}
          </span>
          <span className="ml-auto text-[11px] font-medium text-surface-500 dark:text-surface-400">
            {timeAgo}
          </span>
        </div>

        <div className="ml-9 mt-3">
          <button
            onClick={() => onRestoreSession(session)}
            className="rounded-lg bg-brand-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-brand-600/30 transition-all hover:bg-brand-700 hover:shadow-md"
          >
            Restore All
          </button>
        </div>
      </div>

      {/* Expanded: Groups & Tabs */}
      {expanded && (
        <div className="border-t-2 border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800/50">
          {session.groups.map((group) => {
            const colors = GROUP_COLOR_MAP[group.color as ChromeGroupColor] ?? GROUP_COLOR_MAP.grey;
            const isGroupExpanded = expandedGroups.has(group.id);

            return (
              <div key={group.id} className="border-b border-surface-200 last:border-b-0 dark:border-surface-700">
                {/* Group header */}
                <div className="flex items-center gap-2 px-4 py-2.5">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="flex items-center gap-2"
                  >
                    <svg
                      className={`h-3.5 w-3.5 text-surface-500 transition-transform dark:text-surface-400 ${isGroupExpanded ? "rotate-90" : ""}`}
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
                  <span className="text-[11px] font-semibold text-surface-500 dark:text-surface-400">
                    ({group.tabs.length})
                  </span>
                  <button
                    onClick={() => onRestoreGroup(group)}
                    className={`ml-auto rounded-md border px-2.5 py-1 text-[11px] font-bold transition-colors ${colors.border} ${colors.text} hover:opacity-80`}
                  >
                    Open Group
                  </button>
                </div>

                {/* Tabs within group */}
                {isGroupExpanded && (
                  <div className="pb-1 pl-8 pr-3">
                    {group.tabs.map((tab) => {
                      const domain = (() => {
                        try { return new URL(tab.url).hostname.replace("www.", ""); }
                        catch { return ""; }
                      })();
                      return (
                        <button
                          key={tab.id}
                          onClick={() => onOpenTab(tab)}
                          className="group flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-surface-100 dark:hover:bg-surface-700"
                        >
                          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-surface-200 dark:bg-surface-700">
                            {tab.favIconUrl ? (
                              <img src={tab.favIconUrl} alt="" className="h-3.5 w-3.5 rounded-sm" />
                            ) : (
                              <svg className="h-3 w-3 text-surface-500 dark:text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          <svg className="h-3.5 w-3.5 flex-shrink-0 text-surface-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

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

export const SESSION_COLOR_OPTIONS = Object.keys(SESSION_COLORS);
