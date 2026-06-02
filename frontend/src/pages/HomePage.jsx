import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import SectionTitle from '../components/SectionTitle'
import { useCart } from '../contexts/CartContext'

export default function HomePage() {
  const [catalog, setCatalog] = useState({ products: [], stock: [], settings: {} })
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState({ customer_name: '', phone: '', address: '', observations: '' })
  const [message, setMessage] = useState('')
  const { items, addItem, setComplement, removeItem, clear } = useCart()

  useEffect(() => {
    api.get('/api/catalog').then(({ data }) => setCatalog(data)).finally(() => setLoading(false))
  }, [])

  const complementCandidates = useMemo(() => catalog.stock.filter((item) => item.available_for_complement), [catalog.stock])
  const stockById = useMemo(() => new Map(catalog.stock.map((item) => [item.id, item])), [catalog.stock])
  const orderTotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const paidComplements = item.complements.slice(3)
      const complementsTotal = paidComplements.reduce((complementsSum, complement) => {
        const stockProduct = complement.stock_product || stockById.get(complement.stock_product_id)
        return complementsSum + (stockProduct?.complement_extra_price || 0) * complement.quantity_consumed * item.quantity
      }, 0)
      return sum + item.product.price * item.quantity + complementsTotal
    }, 0)
  }, [items, stockById])

  async function checkout() {
    setMessage('')
    const payload = {
      ...customer,
      delivery_fee: catalog.settings?.taxa_entrega || 0,
      items: items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        complements: item.complements.map((complement) => ({
          stock_product_id: complement.stock_product_id,
          quantity_consumed: complement.quantity_consumed,
        })),
      })),
    }
    const { data } = await api.post('/api/orders', payload)
    setMessage(`Pedido criado com sucesso: ${data.number}`)
    clear()
  }

  if (loading) return <div className="panel">Carregando catálogo...</div>

  return (
    <div className="page-grid">
      <section className="hero panel">
        <SectionTitle
          eyebrow="Storefront"
          title={catalog.settings?.nome_loja || 'WA Açaí'}
          description={catalog.settings?.slogan || 'Catálogo, pedidos e estoque com controle administrativo'}
        />
        <div className="hero-grid">
          <div>
            <p className="muted">{catalog.settings?.descricao_loja}</p>
            <div className="chip-row">
              <span className="chip">{catalog.settings?.loja_aberta ? 'Loja aberta' : 'Loja fechada'}</span>
              <span className="chip">{catalog.settings?.tempo_medio_entrega || 'Entrega rápida'}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <SectionTitle eyebrow="Catálogo" title="Produtos comerciais" description="Escolha um produto e monte o carrinho." />
        <div className="card-grid">
          {catalog.products.map((product) => (
            <article key={product.id} className="card">
              <div className="card__image-shell">
                <div
                  className="card__image"
                  style={product.image_url ? { backgroundImage: `url(${product.image_url})` } : undefined}
                />
              </div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="row">
                <strong>R$ {product.price.toFixed(2)}</strong>
                <button type="button" className="button" onClick={() => addItem(product)}>
                  Adicionar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <SectionTitle
          eyebrow="Carrinho"
          title="Itens selecionados"
          description="Escolha até 3 ingredientes grátis por item. A partir do 4º, há adicional."
        />
        {items.length === 0 ? <p className="muted">Nenhum item adicionado ainda.</p> : null}
        <div className="cart-list">
          {items.map((item) => (
            <article key={item.product.id} className="cart-item">
              <div className="stack">
                <div>
                  <h4>{item.product.name}</h4>
                  <p>Qtd: {item.quantity}</p>
                  <small>{item.complements.length} ingredientes selecionados</small>
                </div>
                <div className="stack">
                  <span className="muted">Ingredientes</span>
                  <div className="chip-row wrap">
                    {complementCandidates.map((stockProduct) => {
                      const selectedIndex = item.complements.findIndex((comp) => comp.stock_product_id === stockProduct.id)
                      const selected = selectedIndex >= 0
                      const isFree = selected && selectedIndex < 3
                      const priceLabel = isFree ? 'Grátis' : `+R$ ${stockProduct.complement_extra_price.toFixed(2)}`

                      return (
                        <button
                          key={stockProduct.id}
                          type="button"
                          className={`chip chip--interactive ${selected ? 'chip--selected' : ''}`}
                          onClick={() => setComplement(item.product.id, stockProduct, !selected)}
                        >
                          {stockProduct.name} {selected ? `• ${priceLabel}` : priceLabel}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
              <button type="button" className="button button--ghost" onClick={() => removeItem(item.product.id)}>
                Remover
              </button>
            </article>
          ))}
        </div>

        <div className="form-grid">
          <label>
            Nome
            <input value={customer.customer_name} onChange={(e) => setCustomer({ ...customer, customer_name: e.target.value })} />
          </label>
          <label>
            Telefone
            <input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
          </label>
          <label>
            Endereço
            <input value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
          </label>
          <label>
            Observações
            <input value={customer.observations} onChange={(e) => setCustomer({ ...customer, observations: e.target.value })} />
          </label>
        </div>
        <div className="row">
          <strong>Total: R$ {orderTotal.toFixed(2)}</strong>
          <button type="button" className="button" onClick={checkout} disabled={items.length === 0}>
            Confirmar pedido
          </button>
        </div>
        {message ? <p className="success">{message}</p> : null}
      </section>
    </div>
  )
}
