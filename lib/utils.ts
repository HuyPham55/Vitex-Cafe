import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Shared localStorage key for customer name (lunch + coffee checkout). */
export const CUSTOMER_NAME_STORAGE_KEY = 'vt_lunch_name';

/** localStorage key for lunch order note. */
export const LUNCH_NOTE_STORAGE_KEY = 'vt_lunch_note';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
