import { useState, useEffect } from "react";
import { SESSION_COLOR_OPTIONS } from "./SessionCard";

interface SaveSessionModalProps {
  onClose: () => void;
  onSave: (name: string, color: string) => void;
  groupCount: number;
  tabCount: number;
}

const COLOR_CLASSES: Record<string, string> = {
  indigo: "bg-indigo-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
  cyan: "bg-cyan-500",
  orange: "bg-orange-500",
};

export function SaveSessionModal({
  onClose,
  onSave,
  groupCount,
  tabCount,
}: SaveSessionModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), color);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-slide-up w-full max-w-sm rounded-2xl bg-surface-0 p-6 shadow-2xl dark:bg-surface-900">
        <h2 className="mb-1 text-base font-bold text-surface-900 dark:text-white">
          Save Current Session
        </h2>
        <p className="mb-4 text-xs font-semibold text-surface-600 dark:text-surface-300">
          {tabCount} tab{tabCount !== 1 ? "s" : ""} across {groupCount} group{groupCount !== 1 ? "s" : ""} will be saved
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-bold text-surface-700 dark:text-surface-300">
              Session Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Work — Sprint 12"
              className="w-full rounded-lg border-2 border-surface-200 bg-surface-0 px-3 py-2.5 text-sm font-medium text-surface-900 placeholder-surface-400 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-surface-600 dark:bg-surface-800 dark:text-white dark:placeholder-surface-400 dark:focus:border-brand-400 dark:focus:ring-brand-800"
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-xs font-bold text-surface-700 dark:text-surface-300">
              Color
            </label>
            <div className="flex gap-2.5">
              {SESSION_COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full transition-all ${COLOR_CLASSES[c]} ${
                    color === c
                      ? "scale-110 ring-2 ring-surface-900 ring-offset-2 dark:ring-white dark:ring-offset-surface-900"
                      : "hover:scale-110"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border-2 border-surface-200 px-4 py-2 text-sm font-bold text-surface-700 transition-colors hover:bg-surface-50 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
