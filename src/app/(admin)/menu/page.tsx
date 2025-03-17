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
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | null>(
    null,
  )

  const subtotal = calculateSubtotal()
  const total = calculateTotal()

  // Fungsi untuk membuat order
  const createOrder = async (cashAmount?: number) => {
    try {
      const orderData = {
        items: cart,
        total,
        subtotal,
        paymentMethod,
        cashAmount: paymentMethod === 'Cash' ? cashAmount : undefined,
        change:
          paymentMethod === 'Cash' ? (cashAmount || 0) - total : undefined,
        createdAt: new Date().toISOString(),
      }

      console.log('Order Created:', orderData)

      // TODO: Kirim ke backend jika ada API untuk order
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData),
      // })
      // const result = await response.json()
      // console.log('Order response:', result)

      // Reset cart dan tutup dialog setelah order dibuat
      setCart([])
      setPaymentDialogOpen(false)
      setPaymentMethod(null)
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

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
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        createOrder={createOrder}
      />
    </div>
  )
}
