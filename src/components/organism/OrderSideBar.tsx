'use client'

import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import type { CartItem } from '@/types'
import { formatIndonesianCurrency } from '@/utils/format'
import Image from 'next/image'

interface OrderSideBarProps {
  cart: CartItem[]
  updateQuantity: (productId: number, change: number) => void
  removeItem: (productId: number) => void
  subtotal?: number
  total: number
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  setPaymentDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const OrderSideBar: React.FC<OrderSideBarProps> = ({
  cart,
  updateQuantity,
  removeItem,
  subtotal,
  total,
  setCart,
  setPaymentDialogOpen,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={`bg-muted/30 flex h-full flex-col border-l transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        {!isCollapsed && (
          <div className="flex gap-2">
            <h2 className="text-lg font-medium">Order</h2>
            <Badge variant="outline">{cart.length} items</Badge>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={isCollapsed ? 'ml-auto' : ''}
        >
          {isCollapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <>
          <div className="flex-1 overflow-scroll">
            {cart.length === 0 ? (
              <div className="text-muted-foreground flex h-40 flex-col items-center justify-center">
                <ShoppingCart className="mb-2 h-10 w-10" />
                <p>Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-background flex flex-col gap-3 rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={item.image || '/botol.jpg'}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="h-12 w-12 rounded"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-medium">
                          {item.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {formatIndonesianCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive h-7 w-7"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <div className="space-y-3">
              <div className="space-y-1.5">
                {subtotal && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatIndonesianCurrency(subtotal)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatIndonesianCurrency(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={cart.length === 0}
                  onClick={() => setCart([])}
                >
                  Clear All
                </Button>
                <Button
                  className="w-full"
                  disabled={cart.length === 0}
                  onClick={() => setPaymentDialogOpen(true)}
                >
                  Pay Now
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
