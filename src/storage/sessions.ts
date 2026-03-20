import { SavedSession, ExportData } from "@/types";

const STORAGE_KEY = "tabflow_sessions";

export async function getSessions(): Promise<SavedSession[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] ?? [];
}

export async function saveSessions(sessions: SavedSession[]): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: sessions });
}

export async function createSession(
  session: Omit<SavedSession, "id" | "createdAt" | "updatedAt">
): Promise<SavedSession> {
  const sessions = await getSessions();
  const newSession: SavedSession = {
    ...session,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  sessions.push(newSession);
  await saveSessions(sessions);
  return newSession;
}

export async function deleteSession(id: string): Promise<void> {
  const sessions = await getSessions();
  await saveSessions(sessions.filter((s) => s.id !== id));
}

export async function updateSession(
  id: string,
  updates: Partial<Pick<SavedSession, "name" | "color" | "groups">>
): Promise<void> {
  const sessions = await getSessions();
  const index = sessions.findIndex((s) => s.id === id);
  if (index !== -1) {
    sessions[index] = {
      ...sessions[index],
      ...updates,
      updatedAt: Date.now(),
    };
    await saveSessions(sessions);
  }
}

export async function exportData(): Promise<string> {
  const sessions = await getSessions();
  const data: ExportData = {
    version: 1,
    exportedAt: Date.now(),
    sessions,
  };
  return JSON.stringify(data, null, 2);
}

export function parseImportData(json: string): ExportData {
  const data = JSON.parse(json);
  if (!data.version || !Array.isArray(data.sessions)) {
    throw new Error("Invalid TabFlow export file");
  }
  return data as ExportData;
}

export async function importData(
  data: ExportData,
  mode: "replace" | "merge"
): Promise<number> {
  if (mode === "replace") {
    await saveSessions(data.sessions);
    return data.sessions.length;
  }

  const existing = await getSessions();
  const existingIds = new Set(existing.map((s) => s.id));
  const newSessions = data.sessions.filter((s) => !existingIds.has(s.id));
  await saveSessions([...existing, ...newSessions]);
  return newSessions.length;
}
