import { useState, useEffect, useCallback } from "react";

interface UseKeyboardNavOptions {
  itemCount: number;
  onSelect: (index: number) => void;
  onClose?: (index: number) => void;
  enabled?: boolean;
}

export function useKeyboardNav({
  itemCount,
  onSelect,
  onClose,
  enabled = true,
}: UseKeyboardNavOptions) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const reset = useCallback(() => setActiveIndex(-1), []);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" && e.key !== "Escape" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

      switch (e.key) {
        case "ArrowDown":
        case "j":
          e.preventDefault();
          setActiveIndex((prev) => (prev < itemCount - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
        case "k":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : itemCount - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0) onSelect(activeIndex);
          break;
        case "x":
          if (target.tagName !== "INPUT" && activeIndex >= 0 && onClose) {
            e.preventDefault();
            onClose(activeIndex);
          }
          break;
        case "Escape":
          e.preventDefault();
          if (activeIndex >= 0) {
            setActiveIndex(-1);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, itemCount, activeIndex, onSelect, onClose]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [itemCount]);

  return { activeIndex, setActiveIndex, reset };
}
