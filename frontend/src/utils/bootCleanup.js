const CLEANUP_FLAG = 'waacai-boot-cleanup-v1'

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
}
