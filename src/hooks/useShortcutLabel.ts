import { useState, useEffect } from "react";

export function useShortcutLabel(commandName: string): string {
  const [label, setLabel] = useState("");

  useEffect(() => {
    chrome.commands.getAll().then((commands) => {
      const cmd = commands.find((c) => c.name === commandName);
      if (cmd?.shortcut) {
        setLabel(formatShortcut(cmd.shortcut));
      }
    });
  }, [commandName]);

  return label;
}

function formatShortcut(raw: string): string {
  // Chrome returns e.g. "Ctrl+Shift+K" or "⌘+Shift+K"
  return raw
    .replace(/Ctrl/g, "Ctrl")
    .replace(/Command/g, "⌘")
    .replace(/MacCtrl/g, "Ctrl")
    .replace(/Alt/g, "Alt")
    .replace(/Shift/g, "⇧")
    .replace(/\+/g, "");
}
