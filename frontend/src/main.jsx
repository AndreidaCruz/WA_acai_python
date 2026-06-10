import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AppCrashBoundary from './components/AppCrashBoundary'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'
import { bootCleanup } from './utils/bootCleanup'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppCrashBoundary>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </AppCrashBoundary>
  </React.StrictMode>,
)

void bootCleanup()
