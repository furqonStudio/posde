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
import { ScrollArea } from '../ui/scroll-area'
import { formatCurrency } from '@/utils/format'
import { Separator } from '../ui/separator'
import type { CartItem } from '@/types'

interface OrderSideBarProps {
  cart: CartItem[]
  updateQuantity: (productId: number, change: number) => void
  removeItem: (productId: number) => void
  subtotal: number
  tax: number
  total: number
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  setPaymentDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const OrderSideBar: React.FC<OrderSideBarProps> = ({
  cart,
  updateQuantity,
  removeItem,
  subtotal,
  tax,
  total,
  setCart,
  setPaymentDialogOpen,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={`bg-muted/30 flex h-full flex-col border-l transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-full md:w-1/3 lg:w-1/4'
      }`}
    >
      <div className="flex items-center justify-between border-b p-4">
        {!isCollapsed && (
          <>
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-lg font-medium">Current Order</h2>
            <Badge variant="outline">{cart.length} items</Badge>
          </>
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
          <ScrollArea className="flex-1">
            {cart.length === 0 ? (
              <div className="text-muted-foreground flex h-40 flex-col items-center justify-center">
                <ShoppingCart className="mb-2 h-10 w-10" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-background flex items-center gap-3 rounded-lg p-2"
                  >
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="h-12 w-12 rounded"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
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
          </ScrollArea>

          <div className="border-t p-4">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
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
