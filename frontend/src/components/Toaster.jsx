import { useToastCenter } from '../contexts/ToastContext'

export default function Toaster() {
  const { toasts, dismiss } = useToastCenter()

  if (toasts.length === 0) return null

  return (
    <div className="toaster" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <article key={toast.id} className={`toast toast--${toast.type}`}>
          <div className="toast__content">
            {toast.title ? <strong>{toast.title}</strong> : null}
            {toast.description ? <p>{toast.description}</p> : null}
          </div>
          <button type="button" className="toast__close" onClick={() => dismiss(toast.id)} aria-label="Fechar notificação">
            ×
          </button>
        </article>
      ))}
    </div>
  )
}
