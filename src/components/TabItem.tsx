import { useEffect, useRef } from "react";
import { TabInfo } from "@/types";

interface TabItemProps {
  tab: TabInfo;
  onSwitch: (tabId: number) => void;
  onClose: (tabId: number) => void;
  isKeyboardActive?: boolean;
  index: number;
}

export function TabItem({
  tab,
  onSwitch,
  onClose,
  isKeyboardActive = false,
  index,
}: TabItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  const domain = (() => {
    try {
      return new URL(tab.url).hostname.replace("www.", "");
    } catch {
      return "";
    }
  })();

  useEffect(() => {
    if (isKeyboardActive && ref.current) {
      ref.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [isKeyboardActive]);

  return (
    <div
      ref={ref}
      onClick={() => onSwitch(tab.id)}
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
      className={`stagger-fade-in group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-all ${
        isKeyboardActive
          ? "bg-brand-50 ring-2 ring-brand-500 dark:bg-brand-900/40 dark:ring-brand-400"
          : tab.active
            ? "bg-brand-50 dark:bg-brand-900/30"
            : "hover:bg-surface-100 dark:hover:bg-surface-800"
      }`}
    >
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-surface-100 dark:bg-surface-700">
        {tab.favIconUrl ? (
          <img
            src={tab.favIconUrl}
            alt=""
            className="h-4 w-4 rounded-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              ((e.target as HTMLImageElement).nextElementSibling as HTMLElement)?.style.removeProperty("display");
            }}
          />
        ) : null}
        <svg
          className="h-3.5 w-3.5 text-surface-500 dark:text-surface-400"
          style={tab.favIconUrl ? { display: "none" } : undefined}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-tight text-surface-900 dark:text-white">
          {tab.title}
        </p>
        <p className="truncate text-[11px] font-medium text-surface-500 dark:text-surface-400">
          {domain}
        </p>
      </div>

      {tab.active && (
        <span className="flex-shrink-0 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
          Active
        </span>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose(tab.id);
        }}
        className="flex-shrink-0 rounded p-1 text-surface-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:text-surface-500 dark:hover:bg-red-950 dark:hover:text-red-400"
        title="Close tab (x)"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
