import { useState, useEffect, useCallback } from "react";
import { SavedSession, ExportData } from "@/types";
import {
  getSessions,
  createSession as create,
  deleteSession as remove,
  updateSession as update,
  exportData,
  parseImportData,
  importData,
} from "@/storage/sessions";

export function useSessions() {
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    const s = await getSessions();
    setSessions(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const createSession = async (
    session: Omit<SavedSession, "id" | "createdAt" | "updatedAt">
  ) => {
    await create(session);
    await fetchSessions();
  };

  const deleteSession = async (id: string) => {
    await remove(id);
    await fetchSessions();
  };

  const updateSession = async (
    id: string,
    updates: Partial<Pick<SavedSession, "name" | "color" | "groups">>
  ) => {
    await update(id, updates);
    await fetchSessions();
  };

  const handleExport = async () => {
    const json = await exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tabflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (
    file: File,
    mode: "replace" | "merge"
  ): Promise<number> => {
    const text = await file.text();
    const data: ExportData = parseImportData(text);
    const count = await importData(data, mode);
    await fetchSessions();
    return count;
  };

  return {
    sessions,
    loading,
    createSession,
    deleteSession,
    updateSession,
    handleExport,
    handleImport,
    refetch: fetchSessions,
  };
}
