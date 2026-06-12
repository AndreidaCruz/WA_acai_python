const CLEANUP_FLAG = 'waacai-boot-cleanup-v1'
const STORAGE_CLEANUP_FLAG = 'waacai-storage-cleanup-v1'
const STORAGE_KEYS_TO_CLEAR = [
  'waacai-token',
  'waacai-user',
  'waacai-cart',
  'waacai-composer-drafts',
  'waacai-composer-staged-items',
  'waacai-last-order-cache',
  'waacai-last-order-number',
  'waacai-order-history',
]

export function clearBootStorage() {
  try {
    if (sessionStorage.getItem(STORAGE_CLEANUP_FLAG) === '1') return
    sessionStorage.setItem(STORAGE_CLEANUP_FLAG, '1')
  } catch {
    // Best-effort cleanup only.
  }

  try {
    for (const key of STORAGE_KEYS_TO_CLEAR) {
      localStorage.removeItem(key)
    }
  } catch {
    // Best-effort cleanup only.
  }
}

export async function bootCleanup() {
  const isLocalDev =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

  if (!import.meta.env.PROD && !isLocalDev) return
  if (sessionStorage.getItem(CLEANUP_FLAG) === '1') return
  sessionStorage.setItem(CLEANUP_FLAG, '1')

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(registrations.map((registration) => registration.unregister()))
    }
  } catch {
    // Best-effort cleanup only.
  }

  try {
    if ('caches' in window) {
      const cacheKeys = await caches.keys()
      await Promise.all(cacheKeys.map((key) => caches.delete(key)))
    }
  } catch {
    // Best-effort cleanup only.
  }

  clearBootStorage()
}
