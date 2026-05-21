import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Shared localStorage key for customer name (lunch + coffee checkout). */
export const CUSTOMER_NAME_STORAGE_KEY = 'vt_lunch_name';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
