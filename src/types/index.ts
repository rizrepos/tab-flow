export interface SavedSession {
  id: string;
  name: string;
  color: string;
  groups: SavedGroup[];
  createdAt: number;
  updatedAt: number;
}

export interface SavedGroup {
  id: string;
  title: string;
  color: ChromeGroupColor;
  tabs: SavedTab[];
  collapsed: boolean;
}

export interface SavedTab {
  id: string;
  url: string;
  title: string;
  favIconUrl?: string;
  pinned: boolean;
}

export type ChromeGroupColor =
  | "grey"
  | "blue"
  | "red"
  | "yellow"
  | "green"
  | "pink"
  | "purple"
  | "cyan"
  | "orange";

export interface TabInfo {
  id: number;
  windowId: number;
  title: string;
  url: string;
  favIconUrl?: string;
  active: boolean;
  pinned: boolean;
  groupId: number;
}

export interface ChromeGroup {
  id: number;
  title: string;
  color: ChromeGroupColor;
  collapsed: boolean;
  windowId: number;
}

export interface GroupedTabs {
  group: ChromeGroup | null;
  tabs: TabInfo[];
}

export interface ExportData {
  version: 1;
  exportedAt: number;
  sessions: SavedSession[];
}
