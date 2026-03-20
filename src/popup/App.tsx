import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Header, ViewType } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { TabGroupSection } from "@/components/TabGroupSection";
import { SessionList } from "@/components/SessionList";
import { SaveSessionModal } from "@/components/SaveSessionModal";
import { ImportExportBar } from "@/components/ImportExportBar";
import { Footer } from "@/components/Footer";
import { useTabs } from "@/hooks/useTabs";
import { useSessions } from "@/hooks/useSessions";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { useSessionNav } from "@/hooks/useSessionNav";
import { useShortcutLabel } from "@/hooks/useShortcutLabel";
import {
  SavedSession,
  SavedGroup,
  SavedTab,
  ChromeGroupColor,
} from "@/types";

export default function App() {
  const {
    tabs,
    groups,
    groupedTabs,
    loading: tabsLoading,
    switchToTab,
    closeTab,
  } = useTabs();
  const {
    sessions,
    loading: sessionsLoading,
    createSession,
    deleteSession,
    handleExport,
    handleImport,
  } = useSessions();
  const { theme, toggle: toggleTheme } = useTheme();

  const [view, setView] = useState<ViewType>("tabs");
  const [search, setSearch] = useState("");
  const [sessionSearch, setSessionSearch] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const sessionSearchRef = useRef<HTMLInputElement>(null);

  const focusSessionSearch = useCallback(() => {
    setView("sessions");
    setTimeout(() => sessionSearchRef.current?.focus(), 50);
  }, []);

  // Check if opened via "search-sessions" command (global shortcut)
  useEffect(() => {
    chrome.storage.session.get("tabflow_open_session_search").then((result) => {
      if (result.tabflow_open_session_search) {
        chrome.storage.session.remove("tabflow_open_session_search");
        focusSessionSearch();
      }
    });
  }, [focusSessionSearch]);

  // Listen for the Chrome command when popup is already open
  useEffect(() => {
    const handler = (command: string) => {
      if (command === "search-sessions") {
        focusSessionSearch();
      }
    };
    chrome.commands.onCommand.addListener(handler);
    return () => chrome.commands.onCommand.removeListener(handler);
  }, [focusSessionSearch]);

  // --- Tab keyboard nav ---
  const allFilteredTabs = useMemo(() => {
    if (!search.trim()) return tabs;
    const q = search.toLowerCase();
    return tabs.filter(
      (tab) =>
        tab.title.toLowerCase().includes(q) ||
        tab.url.toLowerCase().includes(q)
    );
  }, [tabs, search]);

  const handleTabSelect = useCallback(
    (index: number) => {
      const tab = allFilteredTabs[index];
      if (tab) switchToTab(tab.id);
    },
    [allFilteredTabs, switchToTab]
  );

  const handleTabClose = useCallback(
    (index: number) => {
      const tab = allFilteredTabs[index];
      if (tab) closeTab(tab.id);
    },
    [allFilteredTabs, closeTab]
  );

  const { activeIndex: tabActiveIndex } = useKeyboardNav({
    itemCount: allFilteredTabs.length,
    onSelect: handleTabSelect,
    onClose: handleTabClose,
    enabled: view === "tabs" && !showSaveModal,
  });

  // --- Session keyboard nav ---
  const handleOpenTab = useCallback(async (tab: SavedTab) => {
    await chrome.tabs.create({ url: tab.url, active: true });
  }, []);

  const handleRestoreGroup = useCallback(async (group: SavedGroup) => {
    await restoreGroup(group);
  }, []);

  const handleRestoreSession = useCallback(async (session: SavedSession) => {
    for (const group of session.groups) {
      await restoreGroup(group);
    }
  }, []);

  const sessionNav = useSessionNav({
    sessions,
    search: sessionSearch,
    enabled: view === "sessions" && !showSaveModal,
    onOpenTab: handleOpenTab,
    onRestoreGroup: handleRestoreGroup,
    onRestoreSession: handleRestoreSession,
  });

  // --- Save session ---
  const handleSaveSession = async (name: string, color: string) => {
    const savedGroups: SavedGroup[] = groupedTabs.map((gt) => ({
      id: crypto.randomUUID(),
      title: gt.group?.title ?? "Ungrouped",
      color: (gt.group?.color ?? "grey") as ChromeGroupColor,
      collapsed: gt.group?.collapsed ?? false,
      tabs: gt.tabs.map(
        (t): SavedTab => ({
          id: crypto.randomUUID(),
          url: t.url,
          title: t.title,
          favIconUrl: t.favIconUrl,
          pinned: t.pinned,
        })
      ),
    }));
    await createSession({ name, color, groups: savedGroups });
  };

  const sessionShortcut = useShortcutLabel("search-sessions");

  const loading = tabsLoading || sessionsLoading;
  let tabStartIndex = 0;

  return (
    <div className="flex h-[560px] flex-col bg-surface-50 dark:bg-surface-950">
      <Header
        tabCount={tabs.length}
        groupCount={groups.length}
        view={view}
        onViewChange={setView}
        darkMode={theme === "dark"}
        onToggleTheme={toggleTheme}
      />

      <div className="flex-1 overflow-y-auto">
        {view === "tabs" ? (
          <div className="p-3">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex-1">
                <SearchBar value={search} onChange={setSearch} />
              </div>
              <button
                onClick={() => setShowSaveModal(true)}
                className="flex h-[38px] items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-xs font-bold text-white transition-colors hover:bg-brand-700"
                title="Save current tabs & groups as a session"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
              </div>
            ) : search ? (
              allFilteredTabs.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-sm font-bold text-surface-500 dark:text-surface-400">
                    No matching tabs
                  </p>
                  <p className="mt-1 text-xs font-medium text-surface-400 dark:text-surface-500">
                    Try a different search term
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {allFilteredTabs.map((tab, i) => (
                    <div
                      key={tab.id}
                      onClick={() => switchToTab(tab.id)}
                      className={`group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                        tabActiveIndex === i
                          ? "bg-brand-50 ring-2 ring-brand-500 dark:bg-brand-900/40 dark:ring-brand-400"
                          : "hover:bg-surface-100 dark:hover:bg-surface-800"
                      }`}
                    >
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-surface-100 dark:bg-surface-700">
                        {tab.favIconUrl ? (
                          <img src={tab.favIconUrl} alt="" className="h-4 w-4 rounded-sm" />
                        ) : (
                          <svg className="h-3.5 w-3.5 text-surface-500 dark:text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-surface-900 dark:text-white">{tab.title}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                        className="flex-shrink-0 rounded p-1 text-surface-400 opacity-0 transition-all hover:text-red-600 group-hover:opacity-100 dark:text-surface-500"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="space-y-2">
                {groupedTabs.map((gt, sectionIndex) => {
                  const section = (
                    <TabGroupSection
                      key={gt.group?.id ?? "ungrouped"}
                      groupedTabs={gt}
                      onSwitch={switchToTab}
                      onClose={closeTab}
                      activeTabIndex={tabActiveIndex}
                      startIndex={tabStartIndex}
                      sectionIndex={sectionIndex}
                    />
                  );
                  tabStartIndex += gt.tabs.length;
                  return section;
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="p-3">
            <div className="mb-2 flex items-center gap-2">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500 dark:text-surface-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={sessionSearchRef}
                  type="text"
                  value={sessionSearch}
                  onChange={(e) => setSessionSearch(e.target.value)}
                  placeholder="Search sessions, groups, tabs..."
                  className="w-full rounded-lg border border-surface-200 bg-surface-0 py-2 pl-10 pr-10 text-sm font-medium text-surface-900 placeholder-surface-400 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-surface-600 dark:bg-surface-800 dark:text-white dark:placeholder-surface-400 dark:focus:border-brand-400 dark:focus:ring-brand-800"
                />
                {!sessionSearch && (
                  <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-surface-300 bg-surface-100 px-1 py-0.5 text-[9px] font-bold text-surface-500 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-300">
                    {sessionShortcut || "⇧⌘K"}
                  </kbd>
                )}
                {sessionSearch && (
                  <button
                    onClick={() => setSessionSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-white"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <ImportExportBar
                onExport={handleExport}
                onImport={handleImport}
              />
            </div>

            {sessions.length === 0 ? (
              <div className="py-16 text-center">
                <svg className="mx-auto mb-3 h-10 w-10 text-surface-400 dark:text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-sm font-bold text-surface-600 dark:text-surface-300">
                  No saved sessions
                </p>
                <p className="mt-1 text-xs font-medium text-surface-500 dark:text-surface-400">
                  Save your current tabs & groups from the Tabs view
                </p>
              </div>
            ) : sessionNav.flatList.length === 0 && sessionSearch ? (
              <div className="py-16 text-center">
                <p className="text-sm font-bold text-surface-500 dark:text-surface-400">
                  No matching sessions
                </p>
                <p className="mt-1 text-xs font-medium text-surface-400 dark:text-surface-500">
                  Try a different search term
                </p>
              </div>
            ) : (
              <SessionList
                flatList={sessionNav.flatList}
                activeIndex={sessionNav.activeIndex}
                expandedSessions={sessionNav.expandedSessions}
                expandedGroups={sessionNav.expandedGroups}
                onToggleSession={sessionNav.toggleSession}
                onToggleGroup={sessionNav.toggleGroup}
                onRestoreSession={handleRestoreSession}
                onRestoreGroup={handleRestoreGroup}
                onOpenTab={handleOpenTab}
                onDelete={deleteSession}
              />
            )}
          </div>
        )}
      </div>

      <Footer view={view} sessionShortcut={sessionShortcut} />

      {showSaveModal && (
        <SaveSessionModal
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveSession}
          groupCount={groupedTabs.length}
          tabCount={tabs.length}
        />
      )}
    </div>
  );
}

async function restoreGroup(group: SavedGroup): Promise<void> {
  if (group.title === "Ungrouped" && group.color === "grey") {
    for (const tab of group.tabs) {
      await chrome.tabs.create({ url: tab.url, active: false });
    }
  } else {
    const tabIds: number[] = [];
    for (const tab of group.tabs) {
      const created = await chrome.tabs.create({
        url: tab.url,
        active: false,
      });
      if (created.id) tabIds.push(created.id);
    }
    if (tabIds.length > 0) {
      const groupId = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(groupId, {
        title: group.title,
        color: group.color,
        collapsed: group.collapsed,
      });
    }
  }
}
