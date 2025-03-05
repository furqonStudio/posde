'use client'

import { CartItem, Product } from '@/types'
import { useState } from 'react'
import { OrderSideBar } from '@/components/organism/OrderSideBar'
import { SideBar } from '@/components/organism/SideBar'
import { ProductGrid } from '@/components/organism/ProductGrid'
import { useCart } from '@/hooks/useCart'
import { PaymentDialog } from '@/components/molecules/PaymentDialog'

export default function Dashboard() {
  const {
    cart,
    setCart,
    addToCart,
    updateQuantity,
    removeItem,
    calculateSubtotal,
    calculateTax,
    calculateTotal,
  } = useCart()
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

  const subtotal = calculateSubtotal()
  const tax = calculateTax(subtotal)
  const total = calculateTotal()

  return (
    <>
      {/* <ProductGrid addToCart={addToCart} /> */}

      <OrderSideBar
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        subtotal={subtotal}
        tax={tax}
        total={total}
        setCart={setCart}
        setPaymentDialogOpen={setPaymentDialogOpen}
      />

      <PaymentDialog
        paymentDialogOpen={paymentDialogOpen}
        setCart={setCart}
        setPaymentDialogOpen={setPaymentDialogOpen}
        total={total}
      />
    </>
  )
}
