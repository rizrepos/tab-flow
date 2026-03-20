import { useState, useEffect, useMemo } from "react";
import { TabInfo, ChromeGroup, GroupedTabs } from "@/types";

export function useTabs() {
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [groups, setGroups] = useState<ChromeGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const [chromeTabs, chromeGroups] = await Promise.all([
      chrome.tabs.query({}),
      chrome.tabGroups.query({}),
    ]);

    const mappedTabs: TabInfo[] = chromeTabs.map((tab) => ({
      id: tab.id!,
      windowId: tab.windowId!,
      title: tab.title ?? "Untitled",
      url: tab.url ?? "",
      favIconUrl: tab.favIconUrl,
      active: tab.active,
      pinned: tab.pinned,
      groupId: tab.groupId ?? -1,
    }));

    const mappedGroups: ChromeGroup[] = chromeGroups.map((g) => ({
      id: g.id,
      title: g.title ?? "",
      color: g.color as ChromeGroup["color"],
      collapsed: g.collapsed,
      windowId: g.windowId,
    }));

    setTabs(mappedTabs);
    setGroups(mappedGroups);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();

    const refresh = () => fetchAll();

    chrome.tabs.onUpdated.addListener(refresh);
    chrome.tabs.onRemoved.addListener(refresh);
    chrome.tabs.onCreated.addListener(refresh);
    chrome.tabGroups.onUpdated.addListener(refresh);
    chrome.tabGroups.onCreated.addListener(refresh);
    chrome.tabGroups.onRemoved.addListener(refresh);

    return () => {
      chrome.tabs.onUpdated.removeListener(refresh);
      chrome.tabs.onRemoved.removeListener(refresh);
      chrome.tabs.onCreated.removeListener(refresh);
      chrome.tabGroups.onUpdated.removeListener(refresh);
      chrome.tabGroups.onCreated.removeListener(refresh);
      chrome.tabGroups.onRemoved.removeListener(refresh);
    };
  }, []);

  const groupedTabs = useMemo((): GroupedTabs[] => {
    const groupMap = new Map<number, ChromeGroup>();
    groups.forEach((g) => groupMap.set(g.id, g));

    const buckets = new Map<number, TabInfo[]>();
    const ungrouped: TabInfo[] = [];

    tabs.forEach((tab) => {
      if (tab.groupId !== -1 && groupMap.has(tab.groupId)) {
        const bucket = buckets.get(tab.groupId) ?? [];
        bucket.push(tab);
        buckets.set(tab.groupId, bucket);
      } else {
        ungrouped.push(tab);
      }
    });

    const result: GroupedTabs[] = [];

    if (ungrouped.length > 0) {
      result.push({ group: null, tabs: ungrouped });
    }

    buckets.forEach((tabList, groupId) => {
      result.push({ group: groupMap.get(groupId)!, tabs: tabList });
    });

    return result;
  }, [tabs, groups]);

  const switchToTab = async (tabId: number) => {
    const tab = await chrome.tabs.update(tabId, { active: true });
    if (tab.windowId) {
      await chrome.windows.update(tab.windowId, { focused: true });
    }
  };

  const closeTab = async (tabId: number) => {
    await chrome.tabs.remove(tabId);
  };

  return {
    tabs,
    groups,
    groupedTabs,
    loading,
    switchToTab,
    closeTab,
    refetch: fetchAll,
  };
}
