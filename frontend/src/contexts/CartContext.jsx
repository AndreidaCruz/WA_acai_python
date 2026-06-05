import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'waacai-cart'

function createLineId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : []
    return parsed.map((item) => ({
      ...item,
      lineId: item.lineId || createLineId(),
    }))
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(product, complements = [], quantity = 1, options = {}) {
    const normalizedComplements = complements.map((complement) => ({
      stock_product_id: complement.stock_product_id,
      quantity_consumed: complement.quantity_consumed || 1,
      stock_product: complement.stock_product,
    }))
    const normalizedComboParts = (options.comboParts || []).map((part) =>
      part.map((complement) => ({
        stock_product_id: complement.stock_product_id,
        quantity_consumed: complement.quantity_consumed || 1,
        stock_product: complement.stock_product,
      })),
    )
    const configKey = options.isCombo
      ? `combo:${JSON.stringify(normalizedComboParts.map((part) => part.map((complement) => complement.stock_product_id)))}`
      : JSON.stringify(normalizedComplements.map((complement) => complement.stock_product_id))
    setItems((current) => [
      ...current,
      {
        lineId: createLineId(),
        product,
        quantity,
        complements: normalizedComplements,
        comboParts: normalizedComboParts,
        isCombo: Boolean(options.isCombo),
        configKey,
      },
    ])
  }

  function setComplement(productId, stockProduct, enabled) {
    setItems((current) =>
      current.map((item) => {
        if (item.product.id !== productId) return item
        const exists = item.complements.some((comp) => comp.stock_product_id === stockProduct.id)
        const complements = enabled
          ? exists
            ? item.complements.map((comp) =>
                comp.stock_product_id === stockProduct.id
                  ? { ...comp, quantity_consumed: 1, stock_product: stockProduct }
                  : comp,
              )
            : [...item.complements, { stock_product_id: stockProduct.id, quantity_consumed: 1, stock_product: stockProduct }]
          : item.complements.filter((comp) => comp.stock_product_id !== stockProduct.id)
        return { ...item, complements }
      }),
    )
  }

  function removeItem(itemKey) {
    setItems((current) => current.filter((item) => item.lineId !== itemKey && item.configKey !== itemKey && item.product.id !== itemKey))
  }

  function clear() {
    setItems([])
  }

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      if (item.isCombo) {
        const comboPartsTotal = (item.comboParts || []).reduce((partsSum, part) => {
          const paidComplements = part.slice(3)
          const partTotal = paidComplements.reduce(
            (complementsSum, complement) =>
              complementsSum + (complement.stock_product?.complement_extra_price || 0) * complement.quantity_consumed,
            0,
          )
          return partsSum + partTotal
        }, 0)
        return sum + (item.product.price + comboPartsTotal) * item.quantity
      }
      const paidComplements = item.complements.slice(3)
      const complementsTotal = paidComplements.reduce(
        (complementsSum, complement) =>
          complementsSum + (complement.stock_product?.complement_extra_price || 0) * complement.quantity_consumed,
        0,
      )
      return sum + item.product.price * item.quantity + complementsTotal * item.quantity
    }, 0)
  }, [items])

  return <CartContext.Provider value={{ items, total, addItem, setComplement, removeItem, clear, setItems }}>{children}</CartContext.Provider>
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used inside CartProvider')
  return value
}
