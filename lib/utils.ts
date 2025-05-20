import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrentAcademicYear() {
  const today = new Date()
  const month = today.getMonth() + 1
  const year = today.getFullYear()
  if (month >= 9) {
    return `${year}-${year + 1}`
  }else {
    return `${year - 1}-${year}`
  }
}

export function generateAcademicYears(count: number = 5): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let i = 0; i < count; i++) {
    years.push(`${currentYear - i - 1}-${currentYear - i}`);
  }
  return years;
}

export function stableSerialize(obj: Record<string, unknown>): string{
  const sortedKeys = Object.keys(obj).sort()
  const sortedObj: Record<string, unknown> = {}
  sortedKeys.forEach(key => {
    sortedObj[key] = obj[key]
  })

  return JSON.stringify(sortedObj)
}

