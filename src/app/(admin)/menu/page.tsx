'use client'

import { useState } from 'react'
import { OrderSideBar } from '@/components/organism/OrderSideBar'
import { ProductGrid } from '@/components/organism/ProductGrid'
import { useCart } from '@/hooks/useCart'
import { PaymentDialog } from '@/components/molecules/PaymentDialog'

export default function Menu() {
  const {
    cart,
    setCart,
    addToCart,
    updateQuantity,
    removeItem,
    calculateTotal,
  } = useCart()
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

  const total = calculateTotal()

  return (
    <div className="flex w-screen">
      <ProductGrid addToCart={addToCart} />
      <OrderSideBar
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        total={total}
        setCart={setCart}
        setPaymentDialogOpen={setPaymentDialogOpen}
      />
      <PaymentDialog
        cart={cart}
        isOpen={paymentDialogOpen}
        setCart={setCart}
        setIsOpen={setPaymentDialogOpen}
        total={total}
      />
    </div>
  )
}
