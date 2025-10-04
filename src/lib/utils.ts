import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function generateSessionToken(): string {
  return crypto.randomUUID()
}

export function getUserCountryCode(): string {
  // This would typically be done via geolocation API or IP detection
  // For now, default to 'US' - will be enhanced later
  return 'US'
}

export function isValidLanguageCode(code: string): boolean {
  const validCodes = [
    'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh',
    'ar', 'am', 'bg', 'ca', 'cs', 'da', 'nl', 'et', 'fi', 'el',
    'he', 'hi', 'hr', 'hu', 'is', 'id', 'ga', 'lt', 'lv', 'mt',
    'no', 'pl', 'ro', 'sk', 'sl', 'sv', 'tr', 'uk', 'vi', 'cy'
  ]
  return validCodes.includes(code.toLowerCase())
}
