import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes with tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number as Korean Won
 */
export function formatKRW(value: number): string {
  return value.toLocaleString('ko-KR');
}

/**
 * Format number as percentage
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
