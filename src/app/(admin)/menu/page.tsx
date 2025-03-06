'use client'

import { useState } from 'react'
import { OrderSideBar } from '@/components/organism/OrderSideBar'
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
    calculateTotal,
  } = useCart()
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

  const subtotal = calculateSubtotal()
  const total = calculateTotal()

  return (
    <div className="flex w-screen">
      <ProductGrid addToCart={addToCart} />
      <OrderSideBar
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        subtotal={subtotal}
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
    </div>
  )
}
