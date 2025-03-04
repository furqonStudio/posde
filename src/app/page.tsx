'use client'

import { CartItem, Product } from '@/types'
import { useState } from 'react'
import { OrderSideBar } from '@/components/organism/OrderSideBar'
import { SideBar } from '@/components/organism/SideBar'
import { ProductGrid } from '@/components/organism/ProductGrid'
import { PaymentDialog } from '@/components/molecules/PaymentDIalog'
import { useCart } from '@/hooks/useCart'

export default function Home() {
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
    <main className="bg-background min-h-screen">
      <div className="flex h-screen">
        <SideBar />

        <ProductGrid addToCart={addToCart} />

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
      </div>
    </main>
  )
}
