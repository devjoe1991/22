import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// New function for generating user colors
const COLORS = [
  'bg-red-200', 'text-red-800',
  'bg-blue-200', 'text-blue-800',
  'bg-green-200', 'text-green-800',
  'bg-yellow-200', 'text-yellow-800',
  'bg-purple-200', 'text-purple-800',
  'bg-pink-200', 'text-pink-800',
  'bg-indigo-200', 'text-indigo-800',
];

export function getUserColor(userId: string) {
  // Simple hash function to get a consistent index
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % (COLORS.length / 2));
  return {
    background: COLORS[index * 2],
    text: COLORS[index * 2 + 1],
  };
} 