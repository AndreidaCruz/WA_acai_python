import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import SectionTitle from '../components/SectionTitle'
import { useAuth } from '../contexts/AuthContext'
import { emitNotification } from '../utils/notifications'

const ADMIN_SECTIONS = [
  { id: 'overview', label: 'Visão geral' },
  { id: 'stock', label: 'Estoque' },
  { id: 'users', label: 'Usuários' },
]

export default function AdminPage() {
  const { user, loading: authLoading, logout, login: authLogin, setSession } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [setupStatus, setSetupStatus] = useState({ needs_setup: false })
  const [setupForm, setSetupForm] = useState({ name: 'Administrador', email: '', password: '' })
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [dashboard, setDashboard] = useState(null)
  const [stock, setStock] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [activeSection, setActiveSection] = useState('overview')
  const [lastRefresh, setLastRefresh] = useState(null)
  const [message, setMessage] = useState('')

  async function loadAdminData() {
    const [dash, stockRes, ordersRes, usersRes] = await Promise.all([
      api.get('/api/admin/dashboard'),
      api.get('/api/admin/stock'),
      api.get('/api/admin/orders'),
      api.get('/api/admin/users'),
    ])
    setDashboard(dash.data)
    setStock(stockRes.data)
    setOrders(ordersRes.data)
    setUsers(usersRes.data)
    setLastRefresh(new Date())
  }

  async function bootstrapAdmin() {
    setMessage('')
    try {
      const { data } = await api.post('/api/auth/bootstrap-admin', setupForm)
      await setSession(data.access_token)
      setSetupStatus({ needs_setup: false })
      setMessage('Admin inicial configurado com sucesso.')
      emitNotification({
        type: 'success',
        title: 'Admin inicial criado',
        description: 'O primeiro administrador foi configurado com sucesso.',
      })
    } catch (error) {
      setMessage('Não foi possível criar o admin inicial.')
      if (!error?.response) {
        emitNotification({
          type: 'error',
          title: 'Falha no setup',
          description: 'Não foi possível criar o admin inicial.',
        })
      }
    }
  }

  async function login() {
    setMessage('')
    try {
      const sessionUser = await authLogin(credentials.email, credentials.password)
      if (sessionUser.role !== 'admin') {
        const text = 'Usuário autenticado, mas sem permissão de admin.'
        setMessage(text)
        emitNotification({
          type: 'warning',
          title: 'Permissão insuficiente',
          description: text,
        })
        return
      }
      setActiveSection('overview')
      setMessage('Autenticado como admin.')
      emitNotification({
        type: 'success',
        title: 'Login administrativo',
        description: 'A sessão admin foi validada com sucesso.',
      })
    } catch (error) {
      setMessage('Não foi possível entrar com esses dados.')
      if (!error?.response) {
        emitNotification({
          type: 'error',
          title: 'Usuário inválido',
          description: 'Não foi possível entrar com esses dados.',
        })
      }
    }
  }

  useEffect(() => {
    api.get('/api/auth/setup-status').then(({ data }) => setSetupStatus(data)).catch(() => null)
  }, [])

  useEffect(() => {
    if (!isAdmin) {
      setDashboard(null)
      setStock([])
      setOrders([])
      setUsers([])
      return
    }
    loadAdminData().catch(() => null)
  }, [isAdmin])

  useEffect(() => {
    if (!isAdmin) return undefined
    const interval = window.setInterval(() => {
      loadAdminData().catch(() => null)
    }, 30000)
    return () => window.clearInterval(interval)
  }, [isAdmin])

  async function adjustStock(id, delta) {
    try {
      const { data } = await api.patch(`/api/admin/stock/${id}`, null, { params: { quantity_delta: delta } })
      setStock((current) => current.map((item) => (item.id === id ? data : item)))
      await loadAdminData()
      emitNotification({
        type: 'success',
        title: 'Estoque atualizado',
        description: `${data.name} ajustado em ${delta > 0 ? '+' : ''}${delta}.`,
      })
    } catch (error) {
      setMessage('Não foi possível atualizar o estoque.')
      if (!error?.response) {
        emitNotification({
          type: 'error',
          title: 'Erro no estoque',
          description: 'Não foi possível atualizar o estoque.',
        })
      }
    }
  }

  async function promoteUser(userId) {
    try {
      const { data } = await api.patch(`/api/admin/users/${userId}/role`, { role: 'admin' })
      await loadAdminData()
      emitNotification({
        type: 'success',
        title: 'Usuário promovido',
        description: `${data.name} agora tem acesso de admin.`,
      })
    } catch (error) {
      setMessage('Não foi possível promover o usuário.')
      if (!error?.response) {
        emitNotification({
          type: 'error',
          title: 'Falha de permissão',
          description: 'Não foi possível promover o usuário.',
        })
      }
    }
  }

  const lowStock = useMemo(() => dashboard?.low_stock || [], [dashboard])

  function renderSection() {
    if (!dashboard) return null

    if (activeSection === 'stock') {
      return (
        <>
          <SectionTitle
            eyebrow="Estoque"
            title="Produtos de estoque"
            description="Ajuste a quantidade e observe quais itens estão com nível crítico."
          />
          <div className="stack">
            {stock.map((item) => (
              <article key={item.id} className="card card--compact">
                <div className="row row--space">
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
        </>
      )
    }

    if (activeSection === 'users') {
      return (
        <>
          <SectionTitle
            eyebrow="Usuários"
            title="Controle de acesso"
            description="Promova clientes cadastrados a admin quando necessário."
          />
          <div className="stack">
            {users.map((item) => (
              <article key={item.id} className="card card--compact">
                <div className="row row--space">
                  <div>
                    <strong>{item.name}</strong>
                    <p className="muted">{item.email}</p>
                    <span className="chip">{item.role}</span>
                  </div>
                  {item.role !== 'admin' ? (
                    <button type="button" className="button button--ghost" onClick={() => promoteUser(item.id)}>
                      Promover a admin
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </>
      )
    }

    return (
      <>
        <SectionTitle
          eyebrow="Visão geral"
          title="Painel administrativo"
          description="Pedidos, estoque, usuários e configurações em uma navegação separada por função."
        />
        <div className="stats-grid">
          <div className="stat">
            <strong>{dashboard.orders}</strong>
            <span>Pedidos</span>
          </div>
          <div className="stat">
            <strong>{lowStock.length}</strong>
            <span>Baixo estoque</span>
          </div>
          <div className="stat">
            <strong>{users.length}</strong>
            <span>Usuários</span>
          </div>
        </div>
        {lastRefresh ? <p className="muted">Atualizado às {lastRefresh.toLocaleTimeString()}</p> : null}
        <SectionTitle eyebrow="Pedidos" title="Últimos pedidos" description="Resumo rápido do fluxo recente." />
        <div className="stack">
          {orders.slice(0, 3).map((order) => (
            <article key={order.id} className="card card--compact">
              <div className="row row--space">
                <div>
                  <strong>{order.number}</strong>
                  <p className="muted">{order.customer_name}</p>
                </div>
                <span className="chip">{order.status}</span>
              </div>
            </article>
          ))}
        </div>
        <SectionTitle eyebrow="Alertas" title="Itens críticos" description="Esses ingredientes precisam de atenção." />
        <div className="stack">
          {lowStock.length > 0 ? (
            lowStock.map((item) => (
              <article key={item.id} className="card card--compact">
                <div className="row row--space">
                  <div>
                    <strong>{item.name}</strong>
                    <p className="muted">
                      {item.quantity_current} {item.unit_measure} disponíveis
                    </p>
                  </div>
                  <span className="chip chip--danger">Baixo estoque</span>
                </div>
              </article>
            ))
          ) : (
            <p className="muted">Nenhum item em nível crítico agora.</p>
          )}
        </div>
      </>
    )
  }

  if (user ? !isAdmin : false) {
    return (
      <section className="panel panel--warning">
        <SectionTitle
          eyebrow="Acesso negado"
          title="Este usuário não é administrador"
          description="O painel administrativo só abre para sessões validadas pelo backend com papel admin."
        />
        <button type="button" className="button button--ghost" onClick={logout}>
          Sair
        </button>
      </section>
    )
  }

  return (
    <section className="stack">
      {user ? (
        <div className="admin-shell">
          <aside className="panel admin-shell__nav">
            <div className="row row--space">
              <SectionTitle eyebrow="Admin" title="Painel" description="Sessão validada pelo backend." />
            </div>
            <div className="stack">
              {ADMIN_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={`admin-nav-item ${activeSection === section.id ? 'admin-nav-item--active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </div>
            <div className="stats-grid admin-shell__stats">
              <div className="stat">
                <strong>{dashboard?.orders || 0}</strong>
                <span>Pedidos</span>
              </div>
              <div className="stat">
                <strong>{dashboard?.low_stock?.length || 0}</strong>
                <span>Alertas</span>
              </div>
            </div>
            <button type="button" className="button button--ghost admin-shell__refresh" onClick={() => loadAdminData().catch(() => null)}>
              Atualizar dados
            </button>
          </aside>
          <div className="stack">
            {!authLoading && isAdmin && dashboard ? <section className="panel">{renderSection()}</section> : null}
            {!authLoading && isAdmin ? (
              <section className="panel">
                <SectionTitle eyebrow="Pedidos" title="Atalho operacional" description="Os pedidos com ação de status ficam na tela de pedidos." />
                <p className="muted">Use a seção <strong>Pedidos</strong> na navegação superior para alterar status, aceitar e finalizar pedidos.</p>
              </section>
            ) : null}
          </div>
        </div>
      ) : (
        <section className="panel">
          <SectionTitle eyebrow="Admin" title="Acesso administrativo" description="Login, setup inicial e validação de sessão." />

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
        </section>
      )}

      {message ? <p className="success">{message}</p> : null}

    </section>
  )
}
