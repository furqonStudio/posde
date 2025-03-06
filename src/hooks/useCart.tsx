import { useState } from 'react'
import { CartItem, Product } from '@/types'

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (productId: number, change: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const calculateTax = (subtotal: number, taxRate = 0.1) => {
    return Math.round(subtotal * taxRate)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    return subtotal
  }

  return {
    cart,
    setCart,
    addToCart,
    updateQuantity,
    removeItem,
    calculateSubtotal,
    calculateTax,
    calculateTotal,
  }
}
