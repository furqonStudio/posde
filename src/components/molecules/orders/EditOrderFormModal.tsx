import React, { useState, useEffect } from 'react'
import { ReusableFormModal } from '../ReusableFormModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import type { Order } from '@/types'

interface EditOrderFormModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
}

export const EditOrderFormModal: React.FC<EditOrderFormModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const [status, setStatus] = useState<string | number>('')

  useEffect(() => {
    if (order) {
      setStatus(String(order.status)) // Pastikan status selalu string
    }
  }, [order])

  const queryClient = useQueryClient()

  const editOrderMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number
      status: string | number
    }) => {
      return axios.patch(`http://localhost:8000/api/orders/${id}`, { status })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', String(order?.id)] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      onClose()
      toast.success('Order updated successfully.')
    },
    onError: () => {
      toast.error('Failed to update order.')
    },
  })

  const handleSaveEdit = () => {
    if (order) {
      editOrderMutation.mutate({ id: order.id, status })
    }
  }

  const orderStatuses = [
    { id: 'pending', name: 'Pending' },
    { id: 'completed', name: 'Completed' },
    { id: 'cancelled', name: 'Cancelled' },
  ]

  const formFields = {
    id: 'status',
    label: 'Status',
    value: status,
    defaultValue: status,
    options: orderStatuses.map((status) => ({
      value: status.id,
      label: status.name,
    })),
    onChange: (value: string | number) => setStatus(String(value)),
  }

  return (
    <ReusableFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSaveEdit}
      title="Edit Order"
      description="Make changes to the order details here."
      selectField={formFields}
    />
  )
}
