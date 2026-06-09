import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import SectionTitle from '../components/SectionTitle'
import { useCart } from '../contexts/CartContext'
import { emitNotification } from '../utils/notifications'

const COMPOSER_DRAFTS_KEY = 'waacai-composer-drafts'
const COMPOSER_STAGED_ITEMS_KEY = 'waacai-composer-staged-items'

function loadComposerDrafts() {
  try {
    return JSON.parse(localStorage.getItem(COMPOSER_DRAFTS_KEY) || '{}')
  } catch {
    return {}
  }
}

function loadComposerStagedItems() {
  try {
    return JSON.parse(localStorage.getItem(COMPOSER_STAGED_ITEMS_KEY) || '[]')
  } catch {
    return []
  }
}

export default function HomePage() {
  const navigate = useNavigate()
  const { items, addItem } = useCart()
  const [catalog, setCatalog] = useState({ products: [], stock: [], settings: {} })
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedComplementIds, setSelectedComplementIds] = useState([])
  const [comboParts, setComboParts] = useState([[], []])
  const [comboStep, setComboStep] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [catalogError, setCatalogError] = useState('')
  const [composerDrafts, setComposerDrafts] = useState(() => loadComposerDrafts())
  const [stagedItems, setStagedItems] = useState(() => loadComposerStagedItems())
  const suppressDraftPersistRef = useRef(false)

  useEffect(() => {
    let active = true

    async function loadCatalog() {
      setLoading(true)
      try {
        const { data } = await api.get('/api/catalog')
        if (!active) return
        setCatalog(data)
        setCatalogError('')
      } catch {
        if (!active) return
        setCatalogError('Não foi possível carregar o cardápio agora. Tente novamente em instantes.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadCatalog()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(COMPOSER_DRAFTS_KEY, JSON.stringify(composerDrafts))
  }, [composerDrafts])

  useEffect(() => {
    localStorage.setItem(COMPOSER_STAGED_ITEMS_KEY, JSON.stringify(stagedItems))
  }, [stagedItems])

  const complementCandidates = useMemo(() => catalog.stock.filter((item) => item.available_for_complement), [catalog.stock])
  const stockById = useMemo(() => new Map(catalog.stock.map((item) => [item.id, item])), [catalog.stock])
  const selectedComplements = useMemo(
    () => selectedComplementIds.map((id) => stockById.get(id)).filter(Boolean),
    [selectedComplementIds, stockById],
  )
  const isComboProduct = selectedProduct?.name === 'Combo'
  const completedComboSelection = useMemo(() => [...comboParts[0], ...selectedComplementIds], [comboParts, selectedComplementIds])
  const selectedPaidComplements = isComboProduct ? completedComboSelection.slice(3) : selectedComplements.slice(3)
  const composerExtraTotal = selectedPaidComplements.reduce((sum, stockProduct) => sum + (stockProduct?.complement_extra_price || 0), 0)
  const stagedItemsCount = stagedItems.length
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  function persistDraft(nextProduct, draft) {
    if (!nextProduct) return
    setComposerDrafts((current) => ({
      ...current,
      [String(nextProduct.id)]: draft,
    }))
  }

  function clearDraft(productId) {
    setComposerDrafts((current) => {
      const next = { ...current }
      delete next[String(productId)]
      return next
    })
  }

  function clearStagedItems() {
    setStagedItems([])
  }

  function buildConfiguredItem() {
    if (!selectedProduct) return null
    const complements = selectedComplementIds
      .map((id) => stockById.get(id))
      .filter(Boolean)
      .map((stockProduct) => ({
        stock_product_id: stockProduct.id,
        quantity_consumed: 1,
        stock_product: stockProduct,
      }))

    if (isComboProduct) {
      const comboPartsPayload = [comboParts[0], selectedComplementIds].map((part) =>
        part
          .map((id) => stockById.get(id))
          .filter(Boolean)
          .map((stockProduct) => ({
            stock_product_id: stockProduct.id,
            quantity_consumed: 1,
            stock_product: stockProduct,
          })),
      )

      return {
        product: selectedProduct,
        quantity: 1,
        complements: [],
        comboParts: comboPartsPayload,
        isCombo: true,
        configKey: `combo:${JSON.stringify(comboPartsPayload.map((part) => part.map((complement) => complement.stock_product_id)))}`,
      }
    }

    return {
      product: selectedProduct,
      quantity,
      complements,
      comboParts: [],
      isCombo: false,
      configKey: JSON.stringify(complements.map((complement) => complement.stock_product_id)),
    }
  }

  function stageCurrentItem() {
    const configuredItem = buildConfiguredItem()
    if (!configuredItem) return
    suppressDraftPersistRef.current = true
    setStagedItems((current) => [...current, configuredItem])
    clearDraft(selectedProduct.id)
    setSelectedComplementIds([])
    setComboParts([[], []])
    setComboStep(0)
    setQuantity(1)
    setMessage(`${selectedProduct.name} salvo para continuar montando.`)
    emitNotification({
      type: 'success',
      title: 'Item salvo',
      description: `${selectedProduct.name} foi guardado no rascunho do pedido.`,
    })
  }

  function isCurrentItemBlank() {
    if (!selectedProduct) return true
    if (isComboProduct) {
      return comboStep === 0 && comboParts[0].length === 0 && comboParts[1].length === 0 && selectedComplementIds.length === 0
    }
    return selectedComplementIds.length === 0 && quantity === 1
  }

  function openComposer(product) {
    const draft = composerDrafts[String(product.id)]
    setSelectedProduct(product)
    setSelectedComplementIds(draft?.selectedComplementIds || [])
    setComboParts(draft?.comboParts || [[], []])
    setComboStep(draft?.comboStep ?? 0)
    setQuantity(draft?.quantity || 1)
    setMessage('')
  }

  function toggleComplement(stockProductId) {
    setSelectedComplementIds((current) =>
      current.includes(stockProductId) ? current.filter((id) => id !== stockProductId) : [...current, stockProductId],
    )
  }

  function closeComposer() {
    setSelectedProduct(null)
  }

  function startNextComboPart() {
    if (!isComboProduct || comboStep !== 0) return
    setComboParts([selectedComplementIds, []])
    setSelectedComplementIds([])
    setComboStep(1)
  }

  function addConfiguredProduct() {
    if (!selectedProduct) return

    const configuredItem = buildConfiguredItem()
    if (!configuredItem) return

    const itemsToAdd = stagedItems.length > 0 && isCurrentItemBlank() ? [...stagedItems] : [...stagedItems, configuredItem]
    itemsToAdd.forEach((item) => {
      addItem(item.product, item.complements, item.quantity, {
        isCombo: item.isCombo,
        comboParts: item.comboParts,
      })
    })

    clearDraft(selectedProduct.id)
    clearStagedItems()
    setMessage(`${itemsToAdd.length} item(ns) adicionado(s) ao carrinho.`)
    emitNotification({
      type: 'success',
      title: itemsToAdd.length > 1 ? 'Itens adicionados' : 'Item adicionado',
      description: `${itemsToAdd.length} item(ns) foi(ram) enviado(s) para o carrinho.`,
    })
    closeComposer()
    navigate('/cart')
  }

  useEffect(() => {
    if (!selectedProduct) return
    if (suppressDraftPersistRef.current) {
      suppressDraftPersistRef.current = false
      return
    }
    persistDraft(selectedProduct, {
      selectedComplementIds,
      comboParts,
      comboStep,
      quantity,
    })
  }, [selectedProduct, selectedComplementIds, comboParts, comboStep, quantity])

  if (loading) return <div className="panel">Carregando cardápio...</div>

  return (
    <div className="page-grid">
      {catalogError ? (
        <section className="panel panel--warning">
          <SectionTitle eyebrow="Atenção" title="Cardápio indisponível" description={catalogError} />
          <button type="button" className="button button--ghost" onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </section>
      ) : null}

      <section className="hero panel">
        <SectionTitle
          eyebrow="Storefront"
          title={catalog.settings?.nome_loja || 'WA Açaí'}
          description={catalog.settings?.slogan || 'Cardápio, pedidos e estoque com controle administrativo'}
        />
        <div className="hero-grid">
          <div>
            <p className="muted">{catalog.settings?.descricao_loja}</p>
            <div className="chip-row">
              <span className="chip">{catalog.settings?.loja_aberta ? 'Loja aberta' : 'Loja fechada'}</span>
              <span className="chip">{catalog.settings?.tempo_medio_entrega || 'Entrega rápida'}</span>
              <span className="chip">{cartCount} no carrinho</span>
            </div>
          </div>
        </div>
      </section>

      <section className="panel">
        <SectionTitle eyebrow="Cardápio" title="Produtos comerciais" description="Clique em um produto para montar o pedido sem rolar a tela inteira." />
        <div className="card-grid">
          {catalog.products.map((product) => (
            <article key={product.id} className="card card--clickable">
              <button type="button" className="card__button-reset" onClick={() => openComposer(product)}>
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
                  <span className="button">Montar</span>
                </div>
              </button>
            </article>
          ))}
        </div>
      </section>

      {message ? <p className="success">{message}</p> : null}

      {selectedProduct ? (
        <div className="modal-backdrop" onClick={closeComposer} role="presentation">
          <section className="modal composer-modal" onClick={(event) => event.stopPropagation()}>
            <div className="row row--space">
              <SectionTitle
                eyebrow="Compor pedido"
                title={selectedProduct.name}
                description="Escolha os complementos antes de enviar para o carrinho."
              />
              <button type="button" className="button button--ghost" onClick={closeComposer}>
                Fechar
              </button>
            </div>

            <div className="composer-grid">
              <div className="composer-preview">
                <div
                  className="composer-preview__image"
                  style={selectedProduct.image_url ? { backgroundImage: `url(${selectedProduct.image_url})` } : undefined}
                />
                <div className="stack">
                  <div className="chip-row wrap">
                    <span className="chip">{selectedProduct.name}</span>
                    <span className="chip">Base R$ {selectedProduct.price.toFixed(2)}</span>
                    {isComboProduct ? <span className="chip">{comboStep + 1}/2</span> : null}
                    {stagedItemsCount > 0 ? <span className="chip chip--selected">{stagedItemsCount} salvo(s)</span> : null}
                  </div>
                  <p className="muted">{selectedProduct.description || 'Monte o seu pedido com complementos e finalize no carrinho.'}</p>
                  <div className="stats-grid">
                    <div className="stat">
                      <strong>3</strong>
                      <span>Ingredientes grátis</span>
                    </div>
                    <div className="stat">
                      <strong>{isComboProduct ? completedComboSelection.length : selectedComplementIds.length}</strong>
                      <span>Selecionados</span>
                    </div>
                    <div className="stat">
                      <strong>{isComboProduct ? 2 : quantity}</strong>
                      <span>{isComboProduct ? 'Açaís' : 'Copos'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="composer-panel">
                <SectionTitle
                  eyebrow="Ingredientes"
                  title={isComboProduct ? `Monte o açaí ${comboStep + 1} de 2` : 'Escolha os complementos'}
                  description={
                    isComboProduct
                      ? 'Escolha os ingredientes deste açaí. Depois avance para montar o próximo do combo.'
                      : 'Os 3 primeiros ingredientes selecionados são gratuitos. Os demais aparecem como adicionais.'
                  }
                />
                <div className="stack composer-list">
                  {complementCandidates.map((stockProduct) => {
                    const selectedIndex = selectedComplementIds.indexOf(stockProduct.id)
                    const selected = selectedIndex >= 0
                    const isFree = selected && selectedIndex < 3
                    const priceLabel = isFree ? 'Grátis' : `+R$ ${stockProduct.complement_extra_price.toFixed(2)}`

                    return (
                      <button
                        key={stockProduct.id}
                        type="button"
                        className={`ingredient-row ${selected ? 'ingredient-row--selected' : ''}`}
                        onClick={() => toggleComplement(stockProduct.id)}
                      >
                        <div className="ingredient-row__info">
                          <strong>{stockProduct.name}</strong>
                          <span>{stockProduct.description || 'Ingrediente do cardápio'}</span>
                        </div>
                        <div className="ingredient-row__meta">
                          <span className={`chip ${selected ? 'chip--selected' : ''}`}>{priceLabel}</span>
                          <span className={`ingredient-row__toggle ${selected ? 'ingredient-row__toggle--on' : ''}`}>
                            {selected ? 'Selecionado' : 'Adicionar'}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="composer-footer">
                  <div className="quantity-stepper">
                    {isComboProduct ? (
                      <strong>Combo 2x 500ml</strong>
                    ) : (
                      <>
                        <button type="button" className="button button--ghost" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                          -
                        </button>
                        <strong>{quantity}</strong>
                        <button type="button" className="button button--ghost" onClick={() => setQuantity((current) => current + 1)}>
                          +
                        </button>
                      </>
                    )}
                  </div>
                  <div className="row row--space composer-summary">
                    <span className="muted">
                      {isComboProduct
                        ? `${completedComboSelection.length} ingrediente(s) escolhidos no combo, ${Math.min(completedComboSelection.length, 6)} grátis`
                        : `${selectedComplementIds.length} ingrediente(s) selecionado(s), ${Math.min(selectedComplementIds.length, 3)} grátis`}
                    </span>
                    <strong>Extra estimado: R$ {(isComboProduct ? composerExtraTotal : composerExtraTotal * quantity).toFixed(2)}</strong>
                  </div>
                  {stagedItems.length > 0 ? (
                    <div className="stack composer-staged">
                      <span className="muted">Itens já montados</span>
                      <div className="chip-row wrap">
                        {stagedItems.map((item, index) => (
                          <span key={`${item.configKey}-${index}`} className="chip chip--success">
                            {item.product.name} {item.isCombo ? '• combo' : `• ${item.quantity}x`}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div className="row row--space">
                    <button
                      type="button"
                      className="button button--ghost"
                      onClick={() => {
                        if (isComboProduct && comboStep === 0) {
                          startNextComboPart()
                          return
                        }
                        stageCurrentItem()
                      }}
                    >
                      Continuar escolhendo
                    </button>
                    <button type="button" className="button" onClick={addConfiguredProduct}>
                      {stagedItemsCount > 0
                        ? 'Adicionar tudo ao carrinho'
                        : isComboProduct
                          ? comboStep === 0
                            ? 'Próximo açaí'
                            : 'Adicionar combo ao carrinho'
                          : 'Adicionar ao carrinho'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}
