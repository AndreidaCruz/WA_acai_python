import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { subscribeNotifications } from '../utils/notifications'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const unsubscribe = subscribeNotifications((toast) => {
      setToasts((current) => [...current, toast])
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id))
      }, 4200)
    })

    return unsubscribe
  }, [])

  const value = useMemo(
    () => ({
      toasts,
      dismiss(id) {
        setToasts((current) => current.filter((item) => item.id !== id))
      },
    }),
    [toasts],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToastCenter() {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToastCenter must be used inside ToastProvider')
  return value
}
