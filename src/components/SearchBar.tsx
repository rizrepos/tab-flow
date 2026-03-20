import { useRef, useEffect } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search tabs... (type to filter)",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500 dark:text-surface-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-surface-200 bg-surface-0 py-2 pl-10 pr-10 text-sm font-medium text-surface-900 placeholder-surface-400 outline-none transition-all focus:border-brand-500 focus:shadow-sm focus:shadow-brand-500/15 focus:ring-2 focus:ring-brand-100 dark:border-surface-600 dark:bg-surface-800 dark:text-white dark:placeholder-surface-400 dark:focus:border-brand-400 dark:focus:ring-brand-800"
        autoFocus
      />
      {!value && (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-surface-300 bg-surface-100 px-1.5 py-0.5 text-[10px] font-bold text-surface-500 dark:border-surface-600 dark:bg-surface-700 dark:text-surface-300">
          /
        </kbd>
      )}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-white"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
