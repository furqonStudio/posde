import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Banknote, CreditCard, Receipt } from 'lucide-react'
import { Input } from '../ui/input'
import { CartItem } from '@/types'

type PaymentDialogProps = {
  paymentDialogOpen: boolean
  setPaymentDialogOpen: (open: boolean) => void
  setCart: (cart: CartItem[]) => void
  total: number
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  paymentDialogOpen,
  setPaymentDialogOpen,
  setCart,
  total,
}) => {
  const [cashAmount, setCashAmount] = useState('')

  const calculateChange = () => {
    const cashValue = Number.parseInt(cashAmount.replace(/\D/g, '')) || 0
    return Math.max(0, cashValue - total)
  }

  return (
    <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{total}</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Card
              </Button>
              <Button variant="outline" className="justify-start">
                <Banknote className="mr-2 h-4 w-4" />
                Cash
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="cash-amount" className="text-sm font-medium">
              Cash Amount
            </label>
            <Input
              id="cash-amount"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              placeholder="Enter cash amount"
            />
          </div>

          {cashAmount && (
            <div className="flex justify-between font-medium">
              <span>Change</span>
              <span>{calculateChange()}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setPaymentDialogOpen(false)
              setCart([])
              setCashAmount('')
            }}
            className="gap-2"
          >
            <Receipt className="h-4 w-4" />
            Complete Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
