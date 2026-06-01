import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          WA Açaí
        </Link>
        <nav className="nav">
          <NavLink to="/">Catálogo</NavLink>
          <NavLink to="/orders">Pedidos</NavLink>
          <NavLink to="/admin">Admin</NavLink>
          <NavLink to="/settings">Configurações</NavLink>
        </nav>
        <div className="topbar__user">
          {user ? <span>{user.name}</span> : <span>Guest</span>}
          {user ? <button className="button button--ghost" onClick={logout}>Sair</button> : null}
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  )
}
