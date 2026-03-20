import { useState } from "react";
import { GroupedTabs } from "@/types";
import { TabItem } from "./TabItem";
import { GROUP_COLOR_MAP } from "./ChromeGroupColors";

interface TabGroupSectionProps {
  groupedTabs: GroupedTabs;
  onSwitch: (tabId: number) => void;
  onClose: (tabId: number) => void;
  activeTabIndex: number;
  startIndex: number;
  sectionIndex: number;
}

export function TabGroupSection({
  groupedTabs,
  onSwitch,
  onClose,
  activeTabIndex,
  startIndex,
  sectionIndex,
}: TabGroupSectionProps) {
  const { group, tabs } = groupedTabs;
  const [collapsed, setCollapsed] = useState(false);

  if (!group) {
    return (
      <div className="space-y-0.5">
        {tabs.map((tab, i) => (
          <TabItem
            key={tab.id}
            tab={tab}
            onSwitch={onSwitch}
            onClose={onClose}
            isKeyboardActive={activeTabIndex === startIndex + i}
            index={startIndex + i}
          />
        ))}
      </div>
    );
  }

  const colors = GROUP_COLOR_MAP[group.color];

  return (
    <div
      style={{ animationDelay: `${sectionIndex * 40}ms` }}
      className={`stagger-fade-in overflow-hidden rounded-lg border-2 ${colors.border}`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors ${colors.bg}`}
      >
        <svg
          className={`h-3.5 w-3.5 transition-transform ${colors.text} ${collapsed ? "" : "rotate-90"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
        </svg>
        <div className={`h-3 w-3 rounded-full ${colors.dot}`} />
        <span className={`text-xs font-bold ${colors.text}`}>
          {group.title || "Unnamed Group"}
        </span>
        <span className={`ml-auto text-[11px] font-bold ${colors.text}`}>
          {tabs.length}
        </span>
      </button>

      {!collapsed && (
        <div className="space-y-0.5 bg-surface-0 p-1 dark:bg-surface-900">
          {tabs.map((tab, i) => (
            <TabItem
              key={tab.id}
              tab={tab}
              onSwitch={onSwitch}
              onClose={onClose}
              isKeyboardActive={activeTabIndex === startIndex + i}
              index={startIndex + i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
