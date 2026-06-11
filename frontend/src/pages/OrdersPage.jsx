import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import SectionTitle from '../components/SectionTitle'
import { emitNotification } from '../utils/notifications'

const STATUS_FLOW = [
  { value: 'ACEITO', label: 'Aceitar' },
  { value: 'EM_PREPARACAO', label: 'Em preparo' },
  { value: 'PRONTO', label: 'Pronto' },
  { value: 'SAINDO_PARA_ENTREGA', label: 'Saiu para entrega' },
  { value: 'FINALIZADO', label: 'Finalizar' },
  { value: 'CANCELADO', label: 'Cancelar' },
]

function formatMoney(value) {
  return Number(value ?? 0).toFixed(2)
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [lastRefresh, setLastRefresh] = useState(null)

  async function loadOrders() {
    setLoading(true)
    try {
      const { data } = await api.get('/api/admin/orders')
      setOrders(data)
      setLastRefresh(new Date())
    } catch (error) {
      if (!error?.response) {
        emitNotification({
          type: 'error',
          title: 'Não foi possível carregar pedidos',
          description: 'Verifique a conexão com o servidor.',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders().catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      loadOrders().catch(() => null)
    }, 15000)

    return () => window.clearInterval(interval)
  }, [])

  async function updateStatus(orderId, status) {
    try {
      const { data } = await api.patch(`/api/orders/${orderId}/status`, { status })
      setOrders((current) => current.map((order) => (order.id === orderId ? data : order)))
      emitNotification({
        type: 'success',
        title: 'Status atualizado',
        description: `Pedido ${data.number} agora está em ${data.status}.`,
      })
    } catch (error) {
      if (!error?.response) {
        emitNotification({
          type: 'error',
          title: 'Não foi possível atualizar',
          description: 'Verifique a conexão com o servidor.',
        })
      }
    }
  }

  async function deleteOrder(order) {
    if (!window.confirm(`Excluir permanentemente o pedido ${order.number}?`)) return
    try {
      await api.delete(`/api/admin/orders/${order.id}`)
      setOrders((current) => current.filter((item) => item.id !== order.id))
      emitNotification({
        type: 'success',
        title: 'Pedido excluído',
        description: `Pedido ${order.number} removido do histórico administrativo.`,
      })
    } catch (error) {
      if (!error?.response) {
        emitNotification({
          type: 'error',
          title: 'Não foi possível excluir',
          description: 'Verifique a conexão com o servidor.',
        })
      }
    }
  }

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'ALL') return orders
    return orders.filter((order) => order.status === statusFilter)
  }, [orders, statusFilter])

  return (
    <section className="panel">
      <div className="row row--space">
        <SectionTitle
          eyebrow="Pedidos"
          title="Operação de pedidos"
          description="Acompanhe a fila e avance o status conforme o preparo e a entrega."
        />
        <div className="stack stack--tight">
          <button type="button" className="button button--ghost" onClick={() => loadOrders().catch(() => null)}>
            Recarregar
          </button>
          {lastRefresh ? <small className="muted">Atualizado às {lastRefresh.toLocaleTimeString()}</small> : null}
        </div>
      </div>

      <div className="chip-row wrap">
        {['ALL', 'ABERTO', 'ACEITO', 'EM_PREPARACAO', 'PRONTO', 'SAINDO_PARA_ENTREGA', 'FINALIZADO', 'CANCELADO'].map((status) => (
          <button
            key={status}
            type="button"
            className={`chip chip--interactive ${statusFilter === status ? 'chip--selected' : ''}`}
            onClick={() => setStatusFilter(status)}
          >
            {status === 'ALL' ? 'Todos' : status}
          </button>
        ))}
      </div>

      {loading ? <p className="muted">Carregando pedidos...</p> : null}

      <div className="stack">
        {filteredOrders.map((order) => (
          <article key={order.id} className="card">
            <div className="row row--space">
              <div>
                <div className="row">
                  <strong>{order.number}</strong>
                  <span className="chip">{order.status}</span>
                </div>
                <p>
                  {order.customer_name} · {order.phone}
                </p>
                <small>{order.address}</small>
              </div>
              <div className="stack stack--tight">
                <strong>R$ {formatMoney(order.total)}</strong>
                <span className="muted">{order.items?.length || 0} item(ns)</span>
              </div>
            </div>

            <div className="chip-row wrap">
              {STATUS_FLOW.map((status) => (
                <button
                  key={`${order.id}-${status.value}`}
                  type="button"
                  className="chip chip--interactive"
                  onClick={() => updateStatus(order.id, status.value)}
                >
                  {status.label}
                </button>
              ))}
              <button
                type="button"
                className="chip chip--interactive"
                onClick={() => deleteOrder(order)}
              >
                Excluir pedido
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
