/**
 * Safe utility functions to prevent Android client-side exceptions
 * Handles localStorage, navigator, window, and network operations safely
 */

// Safe localStorage wrapper
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null
      return localStorage.getItem(key)
    } catch (error) {
      console.warn(`localStorage.getItem('${key}') failed:`, error)
      return null
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window === 'undefined') return false
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      console.warn(`localStorage.setItem('${key}') failed:`, error)
      return false
    }
  },
  
  removeItem: (key: string): boolean => {
    try {
      if (typeof window === 'undefined') return false
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`localStorage.removeItem('${key}') failed:`, error)
      return false
    }
  }
}

// Safe window object access
export const safeWindow = {
  getLocation: () => {
    try {
      if (typeof window === 'undefined') return null
      return window.location
    } catch (error) {
      console.warn('window.location access failed:', error)
      return null
    }
  },
  
  open: (url: string, target?: string): boolean => {
    try {
      if (typeof window === 'undefined') return false
      window.open(url, target)
      return true
    } catch (error) {
      console.warn('window.open failed:', error)
      return false
    }
  },
  
  getLocationOrigin: (): string => {
    try {
      if (typeof window === 'undefined') return 'https://oopsandask.com'
      return window.location.origin
    } catch (error) {
      console.warn('window.location.origin access failed:', error)
      return 'https://oopsandask.com'
    }
  },
  
  getLocationSearch: (): string => {
    try {
      if (typeof window === 'undefined') return ''
      return window.location.search
    } catch (error) {
      console.warn('window.location.search access failed:', error)
      return ''
    }
  },
  
  getInnerWidth: (): number => {
    try {
      if (typeof window === 'undefined') return 1024
      return window.innerWidth
    } catch (error) {
      console.warn('window.innerWidth access failed:', error)
      return 1024
    }
  },
  
  getInnerHeight: (): number => {
    try {
      if (typeof window === 'undefined') return 768
      return window.innerHeight
    } catch (error) {
      console.warn('window.innerHeight access failed:', error)
      return 768
    }
  }
}

// Safe navigator API access
export const safeNavigator = {
  getLanguage: (): string => {
    try {
      if (typeof navigator === 'undefined') return 'en'
      return navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'en'
    } catch (error) {
      console.warn('navigator.language access failed:', error)
      return 'en'
    }
  },
  
  share: async (data: ShareData): Promise<boolean> => {
    try {
      if (typeof navigator === 'undefined') return false
      if (!navigator.share || typeof navigator.share !== 'function') return false
      
      await navigator.share(data)
      return true
    } catch (error) {
      console.warn('navigator.share failed:', error)
      return false
    }
  },
  
  writeText: async (text: string): Promise<boolean> => {
    try {
      if (typeof navigator === 'undefined') return false
      if (!navigator.clipboard || !navigator.clipboard.writeText) return false
      
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.warn('navigator.clipboard.writeText failed:', error)
      return false
    }
  }
}

// Safe fetch with timeout and error handling
export const safeFetch = async (
  url: string, 
  options: RequestInit = {}, 
  timeout = 10000
): Promise<Response> => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    console.warn(`Fetch to ${url} failed:`, error)
    throw error
  }
}

// Safe URLSearchParams creation
export const safeURLSearchParams = (search: string): URLSearchParams | null => {
  try {
    return new URLSearchParams(search)
  } catch (error) {
    console.warn('URLSearchParams creation failed:', error)
    return null
  }
}

// Safe document.querySelector
export const safeQuerySelector = (selector: string): Element | null => {
  try {
    if (typeof document === 'undefined') return null
    return document.querySelector(selector)
  } catch (error) {
    console.warn(`document.querySelector('${selector}') failed:`, error)
    return null
  }
}

// Safe element getBoundingClientRect
export const safeGetBoundingClientRect = (element: Element): DOMRect | null => {
  try {
    return element.getBoundingClientRect()
  } catch (error) {
    console.warn('getBoundingClientRect failed:', error)
    return null
  }
}

// Safe setTimeout with cleanup
export const safeSetTimeout = (callback: () => void, delay: number): (() => void) => {
  try {
    const timeoutId = setTimeout(callback, delay)
    return () => clearTimeout(timeoutId)
  } catch (error) {
    console.warn('setTimeout failed:', error)
    return () => {}
  }
}

// Safe addEventListener with cleanup
export const safeAddEventListener = (
  element: EventTarget,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
): (() => void) => {
  try {
    element.addEventListener(event, handler, options)
    return () => element.removeEventListener(event, handler, options)
  } catch (error) {
    console.warn(`addEventListener('${event}') failed:`, error)
    return () => {}
  }
}

// Error boundary helper for async operations
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  fallback: T,
  errorMessage: string
): Promise<T> => {
  try {
    return await operation()
  } catch (error) {
    console.warn(`${errorMessage}:`, error)
    return fallback
  }
}

// Safe JSON parsing
export const safeJSONParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json)
  } catch (error) {
    console.warn('JSON.parse failed:', error)
    return fallback
  }
}

// Safe JSON stringify
export const safeJSONStringify = (obj: unknown, fallback: string = '{}'): string => {
  try {
    return JSON.stringify(obj)
  } catch (error) {
    console.warn('JSON.stringify failed:', error)
    return fallback
  }
}
