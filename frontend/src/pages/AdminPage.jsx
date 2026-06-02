import { useEffect, useState } from 'react'
import api from '../services/api'
import SectionTitle from '../components/SectionTitle'
import { useAuth } from '../contexts/AuthContext'

export default function AdminPage() {
  const { user, loading: authLoading, logout, login: authLogin, setSession } = useAuth()
  const [setupStatus, setSetupStatus] = useState({ needs_setup: false })
  const [setupForm, setSetupForm] = useState({ name: 'Administrador', email: '', password: '' })
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [dashboard, setDashboard] = useState(null)
  const [stock, setStock] = useState([])
  const [orders, setOrders] = useState([])
  const [message, setMessage] = useState('')

  async function loadAdminData() {
    const [dash, stockRes, ordersRes] = await Promise.all([
      api.get('/api/admin/dashboard'),
      api.get('/api/admin/stock'),
      api.get('/api/admin/orders'),
    ])
    setDashboard(dash.data)
    setStock(stockRes.data)
    setOrders(ordersRes.data)
  }

  async function bootstrapAdmin() {
    setMessage('')
    const { data } = await api.post('/api/auth/bootstrap-admin', setupForm)
    await setSession(data.access_token)
    setSetupStatus({ needs_setup: false })
    setMessage('Admin inicial configurado com sucesso.')
  }

  async function login() {
    setMessage('')
    await authLogin(credentials.email, credentials.password)
    setMessage('Autenticado como admin.')
  }

  useEffect(() => {
    api.get('/api/auth/setup-status').then(({ data }) => setSetupStatus(data)).catch(() => null)
  }, [])

  useEffect(() => {
    if (!user) {
      setDashboard(null)
      setStock([])
      setOrders([])
      return
    }
    loadAdminData().catch(() => null)
  }, [user])

  async function adjustStock(id, delta) {
    const { data } = await api.patch(`/api/admin/stock/${id}`, null, { params: { quantity_delta: delta } })
    setStock((current) => current.map((item) => (item.id === id ? data : item)))
  }

  return (
    <section className="panel">
      {user ? (
        <div className="row">
          <SectionTitle eyebrow="Admin" title="Painel administrativo" description="Você já está autenticado." />
          <button type="button" className="button button--ghost" onClick={logout}>
            Sair
          </button>
        </div>
      ) : (
        <>
          <SectionTitle eyebrow="Admin" title="Acesso administrativo" description="Login, dashboard e estoque." />

          {setupStatus.needs_setup ? (
            <>
              <SectionTitle
                eyebrow="Setup inicial"
                title="Criar primeiro administrador"
                description="Tela de uso único que desaparece depois do primeiro admin ser criado."
              />
              <div className="form-grid">
                <label>
                  Nome
                  <input value={setupForm.name} onChange={(e) => setSetupForm({ ...setupForm, name: e.target.value })} />
                </label>
                <label>
                  E-mail
                  <input value={setupForm.email} onChange={(e) => setSetupForm({ ...setupForm, email: e.target.value })} />
                </label>
                <label>
                  Senha
                  <input
                    type="password"
                    value={setupForm.password}
                    onChange={(e) => setSetupForm({ ...setupForm, password: e.target.value })}
                  />
                </label>
              </div>
              <button type="button" className="button" onClick={bootstrapAdmin}>
                Inicializar admin
              </button>
            </>
          ) : (
            <>
              <div className="form-grid">
                <label>
                  E-mail
                  <input value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} />
                </label>
                <label>
                  Senha
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  />
                </label>
              </div>
              <button type="button" className="button" onClick={login}>
                Entrar como admin
              </button>
            </>
          )}
        </>
      )}

      {message ? <p className="success">{message}</p> : null}

      {authLoading ? null : user && dashboard ? (
        <>
          <div className="stats-grid">
            <div className="stat">
              <strong>{dashboard.orders}</strong>
              <span>Pedidos</span>
            </div>
            <div className="stat">
              <strong>{dashboard.low_stock.length}</strong>
              <span>Baixo estoque</span>
            </div>
            <div className="stat">
              <strong>{dashboard.settings.nome_loja}</strong>
              <span>Loja</span>
            </div>
          </div>

          <SectionTitle eyebrow="Estoque" title="Produtos de estoque" />
          <div className="stack">
            {stock.map((item) => (
              <article key={item.id} className="card card--compact">
                <div className="row">
                  <div>
                    <strong>{item.name}</strong>
                    <p className="muted">
                      {item.quantity_current} {item.unit_measure}
                    </p>
                  </div>
                  <div className="row">
                    <button type="button" className="button button--ghost" onClick={() => adjustStock(item.id, 10)}>
                      +10
                    </button>
                    <button type="button" className="button button--ghost" onClick={() => adjustStock(item.id, -10)}>
                      -10
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <SectionTitle eyebrow="Pedidos" title="Últimos pedidos" />
          <div className="stack">
            {orders.map((order) => (
              <article key={order.id} className="card card--compact">
                <strong>{order.number}</strong>
                <p>{order.customer_name}</p>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}
