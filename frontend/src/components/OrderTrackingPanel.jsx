import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import SectionTitle from './SectionTitle'

const ORDER_STEPS = ['ABERTO', 'ACEITO', 'EM_PREPARACAO', 'PRONTO', 'SAINDO_PARA_ENTREGA', 'FINALIZADO']
const LAST_ORDER_CACHE_KEY = 'waacai-last-order-cache'

function isValidOrder(order) {
  return Boolean(order && typeof order === 'object' && typeof order.number === 'string' && order.number.trim())
}

function loadCachedOrder() {
  try {
    const raw = localStorage.getItem(LAST_ORDER_CACHE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return isValidOrder(parsed) ? parsed : null
  } catch {
    return null
  }
}

function saveCachedOrder(order) {
  try {
    if (!isValidOrder(order)) {
      localStorage.removeItem(LAST_ORDER_CACHE_KEY)
      return
    }
    localStorage.setItem(LAST_ORDER_CACHE_KEY, JSON.stringify(order))
  } catch {
    // Ignore storage errors so the tracker can still render.
  }
}

function clearCachedOrder({ clearStoredNumber = true } = {}) {
  try {
    localStorage.removeItem(LAST_ORDER_CACHE_KEY)
    if (clearStoredNumber) {
      localStorage.removeItem('waacai-last-order-number')
    }
  } catch {
    // Ignore storage errors so the tracker can still recover.
  }
}

function formatMoney(value) {
  return Number(value ?? 0).toFixed(2)
}

function normalizeOrderNumber(orderNumber) {
  return String(orderNumber ?? '').trim().replace(/^#/, '')
}

function groupOrderItemComplements(item) {
  const complements = item.complements || []
  const hasComboPart = complements.some((complement) => complement.combo_part_index !== null && complement.combo_part_index !== undefined)

  if (!hasComboPart) {
    return complements.length > 0 ? [{ label: 'Complementos', items: complements }] : []
  }

  const groups = new Map()
  complements.forEach((complement) => {
    const key = complement.combo_part_index ?? 0
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key).push(complement)
  })

  return [...groups.entries()]
    .sort(([a], [b]) => a - b)
    .map(([index, groupItems]) => ({
      label: `Açaí ${index + 1} de 2`,
      items: groupItems,
    }))
}

export default function OrderTrackingPanel({ orderNumber: orderNumberProp, title = 'Acompanhamento do pedido', compact = false }) {
  const [storedOrderNumber, setStoredOrderNumber] = useState(() => orderNumberProp || localStorage.getItem('waacai-last-order-number') || '')
  const [order, setOrder] = useState(() => loadCachedOrder())

  const orderNumber = orderNumberProp || storedOrderNumber

  useEffect(() => {
    if (orderNumberProp) {
      setStoredOrderNumber(orderNumberProp)
      return
    }
    setStoredOrderNumber(localStorage.getItem('waacai-last-order-number') || '')
  }, [orderNumberProp])

  const currentOrder = isValidOrder(order) ? order : null

  async function refreshTracking() {
    const apiOrderNumber = normalizeOrderNumber(orderNumber)
    if (!apiOrderNumber) return
    try {
      const { data } = await api.get(`/api/orders/track/${apiOrderNumber}`)
      if (isValidOrder(data)) {
        setOrder(data)
        saveCachedOrder(data)
      }
    } catch (error) {
      const status = error?.response?.status
      if (status === 404) {
        setOrder(null)
        clearCachedOrder({ clearStoredNumber: !orderNumberProp })
        if (!orderNumberProp) {
          setStoredOrderNumber('')
        }
        return
      }
      const cachedOrder = loadCachedOrder()
      if (normalizeOrderNumber(cachedOrder?.number) === apiOrderNumber) {
        setOrder(cachedOrder)
      }
    }
  }

  useEffect(() => {
    if (!orderNumber) return undefined

    let active = true
    refreshTracking().then(() => {
      if (!active) return
    })
    const interval = window.setInterval(refreshTracking, 5000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [orderNumber])

  if (!orderNumber) {
    return null
  }

  if (compact) {
    return (
      <div className="tracking-topbar">
        <Link to="/cart#tracking" className={`tracking-nav-link nav-link--with-icon ${currentOrder ? 'tracking-nav-link--active' : ''}`}>
          <span className="nav-link__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V5Zm5 1.2v11.6h2.2V6.2H9Zm3.2 0v11.6H15V6.2h-2.8Z" />
            </svg>
          </span>
          <span>Acompanhamento</span>
        </Link>
      </div>
    )
  }

  if (!currentOrder) {
    return (
      <section className="panel">
        <SectionTitle eyebrow="Acompanhamento" title="Em preparo" description="Seu pedido está sendo acompanhado em tempo real." />
        <div className="row row--space">
          <strong>{orderNumber}</strong>
          <button type="button" className="button button--ghost" onClick={() => refreshTracking().catch(() => null)}>
            Atualizar agora
          </button>
        </div>
        {loadCachedOrder() ? <p className="muted">Os detalhes do último pedido estão salvos localmente enquanto a atualização acontece.</p> : null}
      </section>
    )
  }

  return (
    <section className="panel">
      <SectionTitle
        eyebrow="Acompanhamento"
        title={`Pedido ${currentOrder.number}`}
        description="Confira exatamente o que foi pedido antes da produção avançar."
      />
      <div className="stats-grid">
        <div className="stat">
          <strong>{currentOrder.status}</strong>
          <span>Status</span>
        </div>
        <div className="stat">
          <strong>R$ {formatMoney(currentOrder.total)}</strong>
          <span>Total</span>
        </div>
        <div className="stat">
          <strong>{currentOrder.items?.length || 0}</strong>
          <span>Itens</span>
        </div>
      </div>

      <div className="card card--compact tracking-summary">
        <div className="tracking-summary__main">
          <strong>{currentOrder.customer_name}</strong>
          <span className="muted">{currentOrder.phone}</span>
          <small>{currentOrder.address}</small>
        </div>
        <div className="tracking-summary__total">
          <strong>R$ {formatMoney(currentOrder.total)}</strong>
          <span className="muted">Total do pedido</span>
        </div>
        {currentOrder.observations ? <p className="muted">Observações: {currentOrder.observations}</p> : null}
      </div>

      <div className="stack tracking-order-list">
        {(currentOrder.items || []).map((item) => {
          const complementGroups = groupOrderItemComplements(item)

          return (
            <article key={item.id} className="card card--compact tracking-order-item">
              <div className="tracking-order-item__header">
                <div className="tracking-order-item__title">
                  <strong>{item.product_name}</strong>
                  <p className="muted">Qtd: {item.quantity}</p>
                </div>
                <div className="tracking-order-item__price">
                  <strong>R$ {formatMoney(item.total_price)}</strong>
                  <span className="muted">R$ {formatMoney(item.unit_price)} cada</span>
                </div>
              </div>

              {complementGroups.length > 0 ? (
                <div className="stack tracking-order-item__groups">
                  {complementGroups.map((group) => (
                    <div key={`${item.id}-${group.label}`} className="stack tracking-order-item__group">
                      <span className="muted">{group.label}</span>
                      <div className="chip-row wrap">
                        {group.items.map((complement) => {
                          const isFree = complement.extra_price === 0
                          return (
                            <span key={complement.id} className="chip">
                              {complement.stock_product_name} x{complement.quantity_consumed} {isFree ? '• grátis' : `• +R$ ${formatMoney(complement.extra_price)}`}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          )
        })}
      </div>

      <div className="chip-row wrap">
        {ORDER_STEPS.map((step) => {
          const isCurrent = currentOrder.status === step
          const currentIndex = ORDER_STEPS.indexOf(currentOrder.status)
          const stepIndex = ORDER_STEPS.indexOf(step)
          const completed = currentIndex > stepIndex
          return (
            <span key={step} className={`chip ${isCurrent ? 'chip--selected' : ''} ${completed ? 'chip--success' : ''}`}>
              {step}
            </span>
          )
        })}
      </div>
      <div className="row row--space">
        <small className="muted">Atualize o pedido para acompanhar a produção sem precisar recarregar a página.</small>
        <button type="button" className="button button--ghost" onClick={() => refreshTracking().catch(() => null)}>
          Atualizar agora
        </button>
      </div>
    </section>
  )
}
