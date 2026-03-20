import { ViewType } from "./Header";

interface FooterProps {
  view: ViewType;
  sessionShortcut: string;
}

export function Footer({ view, sessionShortcut }: FooterProps) {
  return (
    <div className="flex items-center gap-3 border-t-2 border-surface-200 bg-surface-50 px-4 py-2 dark:border-surface-700 dark:bg-surface-900">
      <Shortcut keys={["↑↓"]} label="navigate" />
      {view === "tabs" ? (
        <>
          <Shortcut keys={["↵"]} label="open" />
          <Shortcut keys={["x"]} label="close" />
          <Shortcut keys={["/"]} label="search" />
          {sessionShortcut && (
            <Shortcut keys={[sessionShortcut]} label="sessions" />
          )}
        </>
      ) : (
        <>
          <Shortcut keys={["→"]} label="expand" />
          <Shortcut keys={["←"]} label="collapse" />
          <Shortcut keys={["↵"]} label="open" />
        </>
      )}
    </div>
  );
}

function Shortcut({ keys, label }: { keys: string[]; label: string }) {
  return (
    <span className="flex items-center gap-1">
      {keys.map((k) => (
        <kbd
          key={k}
          className="rounded border border-surface-300 bg-surface-100 px-1.5 py-0.5 text-[10px] font-bold text-surface-600 dark:border-surface-600 dark:bg-surface-800 dark:text-surface-300"
        >
          {k}
        </kbd>
      ))}
      <span className="text-[10px] font-semibold text-surface-500 dark:text-surface-400">
        {label}
      </span>
    </span>
  );
}
