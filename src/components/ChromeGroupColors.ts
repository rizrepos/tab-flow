import { ChromeGroupColor } from "@/types";

export const GROUP_COLOR_MAP: Record<
  ChromeGroupColor,
  { bg: string; text: string; dot: string; border: string }
> = {
  grey: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-800 dark:text-gray-200",
    dot: "bg-gray-500",
    border: "border-gray-300 dark:border-gray-600",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950",
    text: "text-blue-800 dark:text-blue-200",
    dot: "bg-blue-500",
    border: "border-blue-300 dark:border-blue-700",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950",
    text: "text-red-800 dark:text-red-200",
    dot: "bg-red-500",
    border: "border-red-300 dark:border-red-700",
  },
  yellow: {
    bg: "bg-yellow-50 dark:bg-yellow-950",
    text: "text-yellow-800 dark:text-yellow-200",
    dot: "bg-yellow-500",
    border: "border-yellow-300 dark:border-yellow-700",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950",
    text: "text-green-800 dark:text-green-200",
    dot: "bg-green-500",
    border: "border-green-300 dark:border-green-700",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950",
    text: "text-pink-800 dark:text-pink-200",
    dot: "bg-pink-500",
    border: "border-pink-300 dark:border-pink-700",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950",
    text: "text-purple-800 dark:text-purple-200",
    dot: "bg-purple-500",
    border: "border-purple-300 dark:border-purple-700",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-950",
    text: "text-cyan-800 dark:text-cyan-200",
    dot: "bg-cyan-500",
    border: "border-cyan-300 dark:border-cyan-700",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950",
    text: "text-orange-800 dark:text-orange-200",
    dot: "bg-orange-500",
    border: "border-orange-300 dark:border-orange-700",
  },
};
