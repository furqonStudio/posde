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
import { formatIndonesianCurrency } from '@/utils/format'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

type PaymentDialogProps = {
  paymentDialogOpen: boolean
  setPaymentDialogOpen: (open: boolean) => void
  setCart: (cart: CartItem[]) => void
  total: number
  paymentMethod: 'cash' | 'cashless' | null
  setPaymentMethod: (method: 'cash' | 'cashless' | null) => void
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  paymentDialogOpen,
  setPaymentDialogOpen,
  setCart,
  total,
  paymentMethod,
  setPaymentMethod,
}) => {
  const [cashAmount, setCashAmount] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const calculateChange = () => {
    const cashValue = Number.parseInt(cashAmount.replace(/\D/g, '')) || 0
    return Math.max(0, cashValue - total)
  }

  // Query untuk mengirim order ke backend
  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const orderData = {
        total,
        paymentMethod,
        cashAmount: paymentMethod === 'cash' ? Number(cashAmount) : undefined,
        change: paymentMethod === 'cash' ? calculateChange() : undefined,
        createdAt: new Date().toISOString(),
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Gagal membuat order')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Pembayaran berhasil!')
      setCart([]) // Reset cart setelah order sukses
      setPaymentDialogOpen(false)
      setConfirmOpen(false)
      setCashAmount('')
      setPaymentMethod(null)
    },
    onError: () => {
      toast.error('Terjadi kesalahan saat membuat order')
    },
  })

  return (
    <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatIndonesianCurrency(total)}</span>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={paymentMethod === 'cashless' ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => {
                  setPaymentMethod('cashless')
                  setCashAmount('')
                }}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Cashless
              </Button>
              <Button
                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                className="justify-start"
                onClick={() => setPaymentMethod('cash')}
              >
                <Banknote className="mr-2 h-4 w-4" />
                Cash
              </Button>
            </div>
          </div>

          {/* Cash Amount & Change jika metode adalah Cash */}
          {paymentMethod === 'cash' && (
            <>
              <div className="space-y-2">
                <label htmlFor="cash-amount" className="text-sm font-medium">
                  Cash Amount
                </label>
                <Input
                  id="cash-amount"
                  type="number"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  placeholder="Enter cash amount"
                  autoComplete="off"
                />
              </div>

              <div className="flex justify-between font-medium">
                <span>Change</span>
                <span>{formatIndonesianCurrency(calculateChange())}</span>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={!paymentMethod}
            className="gap-2"
          >
            <Receipt className="h-4 w-4" />
            Complete Payment
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Konfirmasi sebelum menyelesaikan pembayaran */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
          </DialogHeader>
          <div className="text-center">
            <p>Apakah Anda yakin ingin menyelesaikan pembayaran?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={() => createOrderMutation.mutate()}
              disabled={createOrderMutation.isPending}
              className="gap-2"
            >
              <Receipt className="h-4 w-4" />
              {createOrderMutation.isPending ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
