import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import Toaster from '../components/Toaster'

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const isAdmin = user?.role === 'admin'
  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : ''

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          WA Açaí
        </Link>
        <nav className="nav nav--primary">
          <NavLink to="/">Cardápio</NavLink>
          {isAdmin ? <NavLink to="/orders">Pedidos</NavLink> : null}
          {isAdmin ? <NavLink to="/admin">Admin</NavLink> : null}
          {isAdmin ? <NavLink to="/settings">Configurações</NavLink> : null}
        </nav>
        <div className="topbar__actions">
          <Link to="/cart" className="cart-button" aria-label={`Abrir carrinho com ${cartCount} item(ns)`}>
            <span className="cart-button__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                <path d="M7 4h-2l-1 2h2l2.4 8.4A2 2 0 0 0 10.3 16H18a2 2 0 0 0 1.9-1.4L22 7H8.4L7 4Zm3 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
              </svg>
            </span>
            <span className="cart-button__badge">{cartCount}</span>
          </Link>
          {user ? (
            <div className="user-chip">
              <div className="avatar">{initials || 'U'}</div>
              <div className="user-chip__meta">
                <strong>{user.name}</strong>
                <span>{isAdmin ? 'Administrador' : 'Cliente'}</span>
              </div>
              {isAdmin ? <span className="chip">Admin</span> : null}
              <button className="button button--ghost" onClick={logout}>
                Sair
              </button>
            </div>
          ) : (
            <Link to="/admin" className="button button--ghost">
              Entrar
            </Link>
          )}
        </div>
      </header>
      <Toaster />
      <main className="container">{children}</main>
    </div>
  )
}
