import { useState, useEffect, useMemo, useCallback } from "react";
import { SavedSession, SavedGroup, SavedTab } from "@/types";

export type NavItemType = "session" | "group" | "tab";

export interface NavItem {
  type: NavItemType;
  id: string;
  session: SavedSession;
  group?: SavedGroup;
  tab?: SavedTab;
  depth: number;
}

interface UseSessionNavOptions {
  sessions: SavedSession[];
  search: string;
  enabled: boolean;
  onOpenTab: (tab: SavedTab) => void;
  onRestoreGroup: (group: SavedGroup) => void;
  onRestoreSession: (session: SavedSession) => void;
}

export function useSessionNav({
  sessions,
  search,
  enabled,
  onOpenTab,
  onRestoreGroup,
  onRestoreSession,
}: UseSessionNavOptions) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const filteredSessions = useMemo(() => {
    if (!search.trim()) return sessions;
    const q = search.toLowerCase();
    return sessions
      .map((session) => {
        // Match session name
        const sessionMatch = session.name.toLowerCase().includes(q);
        // Match group titles or tab titles/urls within
        const filteredGroups = session.groups
          .map((group) => {
            const groupMatch = group.title.toLowerCase().includes(q);
            const filteredTabs = group.tabs.filter(
              (tab) =>
                tab.title.toLowerCase().includes(q) ||
                tab.url.toLowerCase().includes(q)
            );
            if (groupMatch || filteredTabs.length > 0) {
              return { ...group, tabs: groupMatch ? group.tabs : filteredTabs };
            }
            return null;
          })
          .filter((g): g is SavedGroup => g !== null);
        if (sessionMatch || filteredGroups.length > 0) {
          return { ...session, groups: sessionMatch ? session.groups : filteredGroups };
        }
        return null;
      })
      .filter((s): s is SavedSession => s !== null);
  }, [sessions, search]);

  // Auto-expand all when searching
  const effectiveSessions = filteredSessions;
  const effectiveExpandedSessions = useMemo(() => {
    if (search.trim()) {
      return new Set(filteredSessions.map((s) => s.id));
    }
    return expandedSessions;
  }, [search, filteredSessions, expandedSessions]);

  const effectiveExpandedGroups = useMemo(() => {
    if (search.trim()) {
      const ids = new Set<string>();
      filteredSessions.forEach((s) => s.groups.forEach((g) => ids.add(g.id)));
      return ids;
    }
    return expandedGroups;
  }, [search, filteredSessions, expandedGroups]);

  const flatList = useMemo((): NavItem[] => {
    const items: NavItem[] = [];
    for (const session of effectiveSessions) {
      items.push({ type: "session", id: session.id, session, depth: 0 });
      if (effectiveExpandedSessions.has(session.id)) {
        for (const group of session.groups) {
          items.push({ type: "group", id: group.id, session, group, depth: 1 });
          if (effectiveExpandedGroups.has(group.id)) {
            for (const tab of group.tabs) {
              items.push({ type: "tab", id: tab.id, session, group, tab, depth: 2 });
            }
          }
        }
      }
    }
    return items;
  }, [effectiveSessions, effectiveExpandedSessions, effectiveExpandedGroups]);

  const toggleSession = useCallback((id: string) => {
    setExpandedSessions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleGroup = useCallback((id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expand = useCallback((item: NavItem) => {
    if (item.type === "session") {
      setExpandedSessions((prev) => new Set(prev).add(item.session.id));
    } else if (item.type === "group" && item.group) {
      setExpandedGroups((prev) => new Set(prev).add(item.group!.id));
    }
  }, []);

  const collapse = useCallback((item: NavItem) => {
    if (item.type === "session") {
      setExpandedSessions((prev) => {
        const next = new Set(prev);
        next.delete(item.session.id);
        return next;
      });
    } else if (item.type === "group" && item.group) {
      setExpandedGroups((prev) => {
        const next = new Set(prev);
        next.delete(item.group!.id);
        return next;
      });
    } else if (item.type === "tab") {
      // collapse parent group
      if (item.group) {
        setExpandedGroups((prev) => {
          const next = new Set(prev);
          next.delete(item.group!.id);
          return next;
        });
        // move cursor to parent group
        const parentIdx = flatList.findIndex((f) => f.type === "group" && f.id === item.group!.id);
        if (parentIdx >= 0) setActiveIndex(parentIdx);
      }
    }
  }, [flatList]);

  const handleSelect = useCallback((item: NavItem) => {
    if (item.type === "tab" && item.tab) {
      onOpenTab(item.tab);
    } else if (item.type === "group" && item.group) {
      onRestoreGroup(item.group);
    } else if (item.type === "session") {
      onRestoreSession(item.session);
    }
  }, [onOpenTab, onRestoreGroup, onRestoreSession]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inInput = target.tagName === "INPUT";
      // Allow arrow keys and Enter from within search input
      if (inInput && !["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key)) return;

      switch (e.key) {
        case "ArrowDown":
        case "j":
          e.preventDefault();
          setActiveIndex((prev) => (prev < flatList.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
        case "k":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : flatList.length - 1));
          break;
        case "ArrowRight":
        case "l":
          e.preventDefault();
          if (activeIndex >= 0) expand(flatList[activeIndex]);
          break;
        case "ArrowLeft":
        case "h":
          e.preventDefault();
          if (activeIndex >= 0) collapse(flatList[activeIndex]);
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0) handleSelect(flatList[activeIndex]);
          break;
        case "Escape":
          e.preventDefault();
          setActiveIndex(-1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, flatList, activeIndex, expand, collapse, handleSelect]);

  return {
    flatList,
    activeIndex,
    expandedSessions: effectiveExpandedSessions,
    expandedGroups: effectiveExpandedGroups,
    toggleSession,
    toggleGroup,
  };
}
