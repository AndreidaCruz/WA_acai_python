import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'waacai-cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(product) {
    setItems((current) => {
      const found = current.find((item) => item.product.id === product.id)
      if (found) {
        return current.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...current, { product, quantity: 1, complements: [] }]
    })
  }

  function setComplement(productId, stockProduct, enabled) {
    setItems((current) =>
      current.map((item) => {
        if (item.product.id !== productId) return item
        const exists = item.complements.some((comp) => comp.stock_product_id === stockProduct.id)
        const complements = enabled
          ? exists
            ? item.complements.map((comp) =>
                comp.stock_product_id === stockProduct.id ? { ...comp, quantity_consumed: 1 } : comp,
              )
            : [...item.complements, { stock_product_id: stockProduct.id, quantity_consumed: 1 }]
          : item.complements.filter((comp) => comp.stock_product_id !== stockProduct.id)
        return { ...item, complements }
      }),
    )
  }

  function removeItem(productId) {
    setItems((current) => current.filter((item) => item.product.id !== productId))
  }

  function clear() {
    setItems([])
  }

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }, [items])

  return <CartContext.Provider value={{ items, total, addItem, setComplement, removeItem, clear, setItems }}>{children}</CartContext.Provider>
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used inside CartProvider')
  return value
}
