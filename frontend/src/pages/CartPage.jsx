import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import SectionTitle from '../components/SectionTitle'
import { useCart } from '../contexts/CartContext'
import { emitNotification, getErrorMessage } from '../utils/notifications'

const LAST_ORDER_CACHE_KEY = 'waacai-last-order-cache'
const ORDER_HISTORY_KEY = 'waacai-order-history'
const CANCELABLE_STATUSES = new Set(['ABERTO', 'ACEITO', 'EM_PREPARACAO', 'PRONTO'])
const PAYMENT_OPTIONS = [
  { value: 'Pix', label: 'Pix' },
  { value: 'Cartão', label: 'Cartão' },
  { value: 'Dinheiro', label: 'Dinheiro' },
]

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
  if (!isValidOrder(order)) {
    localStorage.removeItem(LAST_ORDER_CACHE_KEY)
    return
  }
  localStorage.setItem(LAST_ORDER_CACHE_KEY, JSON.stringify(order))
}

function loadOrderHistory() {
  try {
    const raw = localStorage.getItem(ORDER_HISTORY_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    const history = Array.isArray(parsed) ? parsed.filter(isValidOrder) : []
    if (history.length > 0) return history
    const cachedOrder = loadCachedOrder()
    return isValidOrder(cachedOrder) ? [cachedOrder] : []
  } catch {
    return []
  }
}

function saveOrderHistory(orders) {
  const validOrders = Array.isArray(orders) ? orders.filter(isValidOrder) : []
  if (validOrders.length === 0) {
    localStorage.removeItem(ORDER_HISTORY_KEY)
    return
  }
  localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(validOrders))
}

function upsertOrderHistory(orders, order) {
  if (!isValidOrder(order)) return Array.isArray(orders) ? orders : []
  return [order, ...(Array.isArray(orders) ? orders : []).filter((current) => current.number !== order.number)]
}

function canCustomerCancel(order) {
  return isValidOrder(order) && CANCELABLE_STATUSES.has(order.status)
}

function formatMoney(value) {
  return Number(value ?? 0).toFixed(2)
}

export default function CartPage() {
  const { items, total, removeItem, clear } = useCart()
  const [customer, setCustomer] = useState({ customer_name: '', phone: '', address: '', observations: '' })
  const [paymentMethod, setPaymentMethod] = useState('Pix')
  const [message, setMessage] = useState('')
  const [lastOrder, setLastOrder] = useState(() => loadCachedOrder())
  const [lastOrderNumber, setLastOrderNumber] = useState(() => localStorage.getItem('waacai-last-order-number') || '')
  const [tracking, setTracking] = useState(() => loadCachedOrder())
  const [orderHistory, setOrderHistory] = useState(() => loadOrderHistory())
  const [settings, setSettings] = useState({ taxa_entrega: 0 })
  const orderSteps = ['ABERTO', 'ACEITO', 'EM_PREPARACAO', 'PRONTO', 'SAINDO_PARA_ENTREGA', 'FINALIZADO']

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const grandTotal = total + (settings.taxa_entrega || 0)
  const averageWait = settings.tempo_medio_entrega?.trim() || '30 a 40 min'
  const currentOrder =
    isValidOrder(tracking) ? tracking : isValidOrder(lastOrder) ? lastOrder : orderHistory.length > 0 ? orderHistory[0] : null
  const trackedOrders = useMemo(
    () => orderHistory.filter((order) => order.number !== currentOrder?.number),
    [orderHistory, currentOrder?.number],
  )
  const canCheckout =
    items.length > 0 &&
    customer.customer_name.trim().length > 0 &&
    customer.phone.trim().length > 0 &&
    customer.address.trim().length > 0

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

  async function refreshOrderByNumber(orderNumber) {
    if (!orderNumber) return null
    try {
      const { data } = await api.get(`/api/orders/track/${orderNumber}`)
      if (isValidOrder(data)) {
        setOrderHistory((current) => upsertOrderHistory(current, data))
        if (orderNumber === lastOrderNumber) {
          setTracking(data)
          setLastOrder(data)
          saveCachedOrder(data)
        }
        return data
      }
    } catch {
      const cachedOrder = loadCachedOrder()
      if (cachedOrder?.number === orderNumber) {
        setOrderHistory((current) => upsertOrderHistory(current, cachedOrder))
        if (orderNumber === lastOrderNumber) {
          setTracking(cachedOrder)
          setLastOrder(cachedOrder)
        }
        return cachedOrder
      }
    }
    return null
  }

  async function refreshTracking() {
    if (!lastOrderNumber) return
    await refreshOrderByNumber(lastOrderNumber)
  }

  useEffect(() => {
    api.get('/api/catalog').then(({ data }) => setSettings(data.settings || { taxa_entrega: 0 })).catch(() => null)
  }, [])

  useEffect(() => {
    saveOrderHistory(orderHistory)
  }, [orderHistory])

  useEffect(() => {
    if (!lastOrderNumber) return undefined

    let active = true

    refreshTracking().then(() => {
      if (!active) return
    })
    const interval = window.setInterval(refreshTracking, 5000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [lastOrderNumber])

  useEffect(() => {
    if (orderHistory.length === 0) return undefined

    const interval = window.setInterval(() => {
      orderHistory.forEach((order) => {
        refreshOrderByNumber(order.number).catch(() => null)
      })
    }, 10000)

    return () => window.clearInterval(interval)
  }, [orderHistory, lastOrderNumber])

  async function checkout() {
    setMessage('')
    if (!canCheckout) {
      const missing = []
      if (!customer.customer_name.trim()) missing.push('nome')
      if (!customer.phone.trim()) missing.push('telefone')
      if (!customer.address.trim()) missing.push('endereço')
      const fieldsText = missing.join(', ')
      const text = `Preencha os campos obrigatórios: ${fieldsText}.`
      setMessage(text)
      emitNotification({
        type: 'warning',
        title: 'Dados obrigatórios',
        description: text,
      })
      return
    }

    try {
      const payload = {
        customer_name: customer.customer_name.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        observations: customer.observations.trim(),
        delivery_fee: settings.taxa_entrega || 0,
        payment_method: paymentMethod,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          complements: item.isCombo
            ? []
            : item.complements.map((complement) => ({
                stock_product_id: complement.stock_product_id,
                quantity_consumed: complement.quantity_consumed,
              })),
          combo_parts: item.isCombo
            ? item.comboParts.map((part) => ({
                complements: part.map((complement) => ({
                  stock_product_id: complement.stock_product_id,
                  quantity_consumed: complement.quantity_consumed,
                })),
              }))
            : [],
        })),
      }
      const { data } = await api.post('/api/orders', payload)
      if (isValidOrder(data)) {
        setLastOrder(data)
        setLastOrderNumber(data.number)
        localStorage.setItem('waacai-last-order-number', data.number)
        saveCachedOrder(data)
        setOrderHistory((current) => upsertOrderHistory(current, data))
        setMessage(`Pedido criado com sucesso: ${data.number}`)
      } else {
        setMessage('Pedido criado, mas a resposta veio incompleta. Tente atualizar o acompanhamento.')
      }
      emitNotification({
        type: 'success',
        title: 'Pedido enviado',
        description: isValidOrder(data) ? `Pedido ${data.number} foi criado com sucesso.` : 'Pedido criado com resposta incompleta.',
      })
      clear()
    } catch (error) {
      const description = getErrorMessage(error)
      setMessage(description)
      emitNotification({
        type: 'error',
        title: 'Pedido não concluído',
        description,
      })
    }
  }

  async function cancelTrackedOrder(orderNumber) {
    if (!orderNumber) return
    try {
      const { data } = await api.patch(`/api/orders/track/${orderNumber}/cancel`)
      if (isValidOrder(data)) {
        setOrderHistory((current) => upsertOrderHistory(current, data))
        if (data.number === lastOrderNumber) {
          setTracking(data)
          setLastOrder(data)
          saveCachedOrder(data)
        }
        setMessage(`Pedido ${data.number} cancelado com sucesso.`)
        emitNotification({
          type: 'success',
          title: 'Pedido cancelado',
          description: `Pedido ${data.number} foi cancelado.`,
        })
      }
    } catch (error) {
      const description = getErrorMessage(error)
      setMessage(description)
      emitNotification({
        type: 'error',
        title: 'Não foi possível cancelar',
        description,
      })
    }
  }

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="row row--space">
          <SectionTitle
            eyebrow="Carrinho"
            title="Seu pedido"
            description="Finalize aqui o pedido que você montou no cardápio e acompanhe a criação do número do pedido."
          />
          <Link to="/" className="button button--ghost">
            Voltar ao cardápio
          </Link>
        </div>
        <div className="chip-row">
          <span className="chip">{items.length} item(ns)</span>
          <span className="chip">{itemCount} unidade(s)</span>
        </div>
      </section>

      <section className="panel">
        {items.length === 0 ? <p className="muted">Nenhum item adicionado ainda.</p> : null}
        <div className="cart-list">
          {items.map((item, index) => (
            <article key={item.lineId || item.configKey || `${item.product.id}-${index}`} className="cart-item">
              <div className="stack">
                <div>
                  <h4>{item.product.name}</h4>
                  <p>Qtd: {item.quantity}</p>
                </div>
                {item.isCombo ? (
                  <div className="stack">
                    {item.comboParts.map((part, partIndex) => (
                      <div key={`${item.configKey}-part-${partIndex}`} className="stack">
                        <span className="muted">Açaí {partIndex + 1} de 2</span>
                        <div className="chip-row wrap">
                          {part.map((complement, index) => (
                            <span key={`${item.configKey}-part-${partIndex}-${complement.stock_product_id}`} className="chip">
                              {complement.stock_product?.name || `Item ${index + 1}`} {index < 3 ? '• grátis' : '• adicional'}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="stack">
                    <span className="muted">Complementos</span>
                    <div className="chip-row wrap">
                      {item.complements.map((complement, index) => (
                        <span key={`${item.configKey}-${complement.stock_product_id}`} className="chip">
                          {complement.stock_product?.name || `Item ${index + 1}`} {index < 3 ? '• grátis' : '• adicional'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => removeItem(item.lineId || item.configKey || item.product.id)}
              >
                Remover
              </button>
            </article>
          ))}
        </div>

        <div className="form-grid">
          <label>
            <span className="field-label">
              Nome <span className="required-mark">*</span>
            </span>
            <input
              required
              autoComplete="name"
              aria-required="true"
              value={customer.customer_name}
              onChange={(e) => setCustomer({ ...customer, customer_name: e.target.value })}
            />
          </label>
          <label>
            <span className="field-label">
              Telefone <span className="required-mark">*</span>
            </span>
            <input
              required
              autoComplete="tel"
              inputMode="tel"
              aria-required="true"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            />
          </label>
          <label>
            <span className="field-label">
              Endereço <span className="required-mark">*</span>
            </span>
            <input
              required
              autoComplete="street-address"
              aria-required="true"
              value={customer.address}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            />
          </label>
          <label>
            <span className="field-label">Observações</span>
            <input value={customer.observations} onChange={(e) => setCustomer({ ...customer, observations: e.target.value })} />
          </label>
          <label>
            <span className="field-label">Forma de pagamento *</span>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              {PAYMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="form-hint">Campos obrigatórios marcados com * precisam ser preenchidos antes de finalizar.</p>

        <div className="row row--space">
          <strong>Total: R$ {grandTotal.toFixed(2)}</strong>
          <button type="button" className="button" onClick={checkout} disabled={!canCheckout}>
            Finalizar pedido
          </button>
        </div>
        {message ? <p className="success">{message}</p> : null}
      </section>

      {currentOrder ? (
        <section className="panel" id="tracking">
          <SectionTitle
            eyebrow="Acompanhamento"
            title="Acompanhe seu pedido"
            description="Veja os detalhes do pedido, status e prazo estimado em um só lugar."
          />
          <div className="card tracking-overview">
            <div className="tracking-overview__hero">
              <div className="stack stack--tight">
                <span className="eyebrow">Pedido</span>
                <h3>{currentOrder.number}</h3>
                <p className="muted">{currentOrder.customer_name}</p>
              </div>
              <div className="chip-row wrap">
                <span className="chip chip--selected">{currentOrder.status}</span>
                <span className="chip">Pagamento: {currentOrder.payment_method || paymentMethod}</span>
                <span className="chip">Espera: {averageWait}</span>
              </div>
            </div>
            <div className="tracking-overview__grid">
              <div className="stat">
                <strong>R$ {formatMoney(currentOrder.total)}</strong>
                <span>Valor do pedido</span>
              </div>
              <div className="stat">
                <strong>{currentOrder.items?.length || 0}</strong>
                <span>Itens</span>
              </div>
              <div className="stat">
                <strong>{currentOrder.payment_method || paymentMethod}</strong>
                <span>Forma de pagamento</span>
              </div>
              <div className="stat">
                <strong>{averageWait}</strong>
                <span>Tempo médio de espera</span>
              </div>
            </div>
            <div className="tracking-overview__details">
              <div>
                <span className="muted">Endereço</span>
                <strong>{currentOrder.address}</strong>
              </div>
              <div>
                <span className="muted">Telefone</span>
                <strong>{currentOrder.phone}</strong>
              </div>
              {currentOrder.observations ? (
                <div>
                  <span className="muted">Observações</span>
                  <strong>{currentOrder.observations}</strong>
                </div>
              ) : null}
            </div>
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
            {orderSteps.map((step) => {
              const isCurrent = currentOrder.status === step
              const currentIndex = orderSteps.indexOf(currentOrder.status)
              const stepIndex = orderSteps.indexOf(step)
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
          {trackedOrders.length > 0 ? (
            <div className="stack" style={{ marginTop: '1rem' }} id="history">
              <SectionTitle
                eyebrow="Pedidos salvos"
                title="Acompanhamentos deste navegador"
                description="Todos os pedidos feitos neste aparelho ficam reunidos aqui para consulta e cancelamento enquanto estiverem elegíveis."
              />
              <div className="stack">
                {trackedOrders.map((order) => (
                  <article key={order.number} className="card card--compact tracking-order-item">
                    <div className="tracking-order-item__header">
                      <div className="tracking-order-item__title">
                        <strong>Pedido {order.number}</strong>
                        <p className="muted">
                          {order.created_at ? new Date(order.created_at).toLocaleString('pt-BR') : 'Sem data'}
                        </p>
                      </div>
                      <div className="tracking-order-item__price">
                        <strong>R$ {formatMoney(order.total)}</strong>
                        <span className="muted">{order.status}</span>
                      </div>
                    </div>

                    <div className="chip-row wrap">
                      <span className="chip">{order.items?.length || 0} item(ns)</span>
                      <span className="chip">{order.status}</span>
                      <span className="chip chip--selected">Total R$ {formatMoney(order.total)}</span>
                    </div>

                    <div className="row row--space">
                      <small className="muted">Acompanhe o status e cancele enquanto o pedido ainda estiver no prazo.</small>
                      <div className="chip-row wrap">
                        <button type="button" className="button button--ghost" onClick={() => refreshOrderByNumber(order.number).catch(() => null)}>
                          Atualizar
                        </button>
                        {canCustomerCancel(order) ? (
                          <button type="button" className="button" onClick={() => cancelTrackedOrder(order.number)}>
                            Cancelar pedido
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
