import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function shortenString(str: string | undefined, len: number) {
  if (!str) {
    return "";
  }

  if (!!str && str.length <= len) {
    return str;
  }

  return str.substring(0, len).concat('...');
}