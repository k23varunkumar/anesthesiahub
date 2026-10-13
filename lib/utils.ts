import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveAssetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  if (path.startsWith('/')) {
    return (base.endsWith('/') ? base : base + '/') + path.slice(1);
  }
  return path;
}
