import { useEffect, useState } from 'react'
import api, { setAuthToken } from '../services/api'
import SectionTitle from '../components/SectionTitle'

export default function AdminPage() {
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
    setAuthToken(data.access_token)
    await loadAdminData()
    setSetupStatus({ needs_setup: false })
    setMessage('Admin inicial configurado com sucesso.')
  }

  async function login() {
    setMessage('')
    const { data } = await api.post('/api/auth/login', credentials)
    setAuthToken(data.access_token)
    await loadAdminData()
    setMessage('Autenticado como admin.')
  }

  useEffect(() => {
    api.get('/api/auth/setup-status').then(({ data }) => setSetupStatus(data)).catch(() => null)
    const token = localStorage.getItem('waacai-token')
    if (token) {
      loadAdminData().catch(() => null)
    }
  }, [])

  async function adjustStock(id, delta) {
    const { data } = await api.patch(`/api/admin/stock/${id}`, null, { params: { quantity_delta: delta } })
    setStock((current) => current.map((item) => (item.id === id ? data : item)))
  }

  return (
    <section className="panel">
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
              <input type="password" value={setupForm.password} onChange={(e) => setSetupForm({ ...setupForm, password: e.target.value })} />
            </label>
          </div>
          <button className="button" onClick={bootstrapAdmin}>Inicializar admin</button>
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
              <input type="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
            </label>
          </div>
          <button className="button" onClick={login}>Entrar como admin</button>
        </>
      )}

      {message ? <p className="success">{message}</p> : null}

      {dashboard ? (
        <>
          <div className="stats-grid">
            <div className="stat"><strong>{dashboard.orders}</strong><span>Pedidos</span></div>
            <div className="stat"><strong>{dashboard.low_stock.length}</strong><span>Baixo estoque</span></div>
            <div className="stat"><strong>{dashboard.settings.nome_loja}</strong><span>Loja</span></div>
          </div>

          <SectionTitle eyebrow="Estoque" title="Produtos de estoque" />
          <div className="stack">
            {stock.map((item) => (
              <article key={item.id} className="card card--compact">
                <div className="row">
                  <div>
                    <strong>{item.name}</strong>
                    <p className="muted">{item.quantity_current} {item.unit_measure}</p>
                  </div>
                  <div className="row">
                    <button className="button button--ghost" onClick={() => adjustStock(item.id, 10)}>+10</button>
                    <button className="button button--ghost" onClick={() => adjustStock(item.id, -10)}>-10</button>
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
