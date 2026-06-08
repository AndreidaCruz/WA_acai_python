import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import SectionTitle from '../components/SectionTitle'
import { useCart } from '../contexts/CartContext'
import { emitNotification, getErrorMessage } from '../utils/notifications'

const LAST_ORDER_CACHE_KEY = 'waacai-last-order-cache'

function loadCachedOrder() {
  try {
    const raw = localStorage.getItem(LAST_ORDER_CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveCachedOrder(order) {
  if (!order) {
    localStorage.removeItem(LAST_ORDER_CACHE_KEY)
    return
  }
  localStorage.setItem(LAST_ORDER_CACHE_KEY, JSON.stringify(order))
}

export default function CartPage() {
  const { items, total, removeItem, clear } = useCart()
  const [customer, setCustomer] = useState({ customer_name: '', phone: '', address: '', observations: '' })
  const [message, setMessage] = useState('')
  const [lastOrder, setLastOrder] = useState(() => loadCachedOrder())
  const [lastOrderNumber, setLastOrderNumber] = useState(() => localStorage.getItem('waacai-last-order-number') || '')
  const [tracking, setTracking] = useState(() => loadCachedOrder())
  const [settings, setSettings] = useState({ taxa_entrega: 0 })
  const orderSteps = ['ABERTO', 'ACEITO', 'EM_PREPARACAO', 'PRONTO', 'SAINDO_PARA_ENTREGA', 'FINALIZADO']

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const grandTotal = total + (settings.taxa_entrega || 0)
  const currentOrder = tracking || lastOrder
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

  async function refreshTracking() {
    if (!lastOrderNumber) return
    try {
      const { data } = await api.get(`/api/orders/track/${lastOrderNumber}`)
      setTracking(data)
      saveCachedOrder(data)
    } catch {
      const cachedOrder = loadCachedOrder()
      if (cachedOrder?.number === lastOrderNumber) {
        setTracking(cachedOrder)
      }
    }
  }

  useEffect(() => {
    api.get('/api/catalog').then(({ data }) => setSettings(data.settings || { taxa_entrega: 0 })).catch(() => null)
  }, [])

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
      setLastOrder(data)
      setLastOrderNumber(data.number)
      localStorage.setItem('waacai-last-order-number', data.number)
      saveCachedOrder(data)
      setMessage(`Pedido criado com sucesso: ${data.number}`)
      emitNotification({
        type: 'success',
        title: 'Pedido enviado',
        description: `Pedido ${data.number} foi criado com sucesso.`,
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
            title={`Pedido ${currentOrder.number}`}
            description="Confira exatamente o que foi pedido antes da produção avançar."
          />
          <div className="stats-grid">
            <div className="stat">
              <strong>{currentOrder.status}</strong>
              <span>Status</span>
            </div>
            <div className="stat">
              <strong>R$ {currentOrder.total.toFixed(2)}</strong>
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
              <strong>R$ {currentOrder.total.toFixed(2)}</strong>
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
                      <strong>R$ {item.total_price.toFixed(2)}</strong>
                      <span className="muted">R$ {item.unit_price.toFixed(2)} cada</span>
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
                                  {complement.stock_product_name} x{complement.quantity_consumed} {isFree ? '• grátis' : `• +R$ ${complement.extra_price.toFixed(2)}`}
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
        </section>
      ) : null}
    </div>
  )
}
