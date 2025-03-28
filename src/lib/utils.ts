import { clsx, type ClassValue } from "clsx";
import { SortOrder } from "mongoose";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseToInteger(
  value: string | null,
  defaultValue: null
): number | null;
export function parseToInteger(
  value: string | null,
  defaultValue: number
): number;
export function parseToInteger(
  value: string | null,
  defaultValue: number | null = null
): number | null {
  if (value === null) return defaultValue;

  const int = parseInt(value, 10);

  return isNaN(int) ? defaultValue : int;
}

export function parseSortBy(
  sortBy: string | null | undefined
): Record<string, SortOrder> | null {
  if (!sortBy) return null;

  const [field, direction] = sortBy.split(":");
  if (!field || !direction) return null;

  return { [field]: direction === "asc" ? 1 : -1 };
}
