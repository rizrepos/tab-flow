import { useRef, useState } from "react";

interface ImportExportBarProps {
  onExport: () => void;
  onImport: (file: File, mode: "replace" | "merge") => Promise<number>;
}

export function ImportExportBar({ onExport, onImport }: ImportExportBarProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const count = await onImport(file, "merge");
      setStatus(`Imported ${count} session${count !== 1 ? "s" : ""}`);
      setTimeout(() => setStatus(null), 3000);
    } catch {
      setStatus("Invalid file format");
      setTimeout(() => setStatus(null), 3000);
    }

    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {status ? (
        <span className="animate-fade-in text-[12px] font-bold text-brand-600 dark:text-brand-300">
          {status}
        </span>
      ) : (
        <>
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 rounded-md border border-surface-300 px-2.5 py-1 text-[11px] font-bold text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-white"
            title="Export all sessions as JSON"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 rounded-md border border-surface-300 px-2.5 py-1 text-[11px] font-bold text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-white"
            title="Import sessions from JSON"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import
          </button>
        </>
      )}
    </div>
  );
}
