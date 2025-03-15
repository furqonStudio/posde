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
  const [formData, setFormData] = useState<Partial<Order>>({
    status: '',
  })

  useEffect(() => {
    if (order) {
      setFormData(order)
    }
  }, [order])

  const queryClient = useQueryClient()

  const editOrderMutation = useMutation({
    mutationFn: async (updateOrder: Order) => {
      await axios.put(
        `http://localhost:8000/api/orders/${updateOrder.id}`, // ✅ Endpoint diperbaiki
        updateOrder,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', String(order?.id)] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      onClose()
      toast.success('Order updated successfully.')
    },
  })

  const handleSaveEdit = () => {
    if (order) {
      editOrderMutation.mutate({ ...order, ...formData })
    }
  }

  const orderStatuses = [
    { id: 'pending', name: 'Pending' },
    { id: 'success', name: 'Success' },
    { id: 'cancelled', name: 'Cancelled' },
  ]
  const formFields = {
    id: 'status',
    label: 'Status',
    value: formData.status ?? '',
    defaultValue: formData.status ? String(formData.status) : '',
    options: orderStatuses.map((status) => ({
      value: status.id,
      label: status.name,
    })),
    onChange: (value: string | number) =>
      setFormData({ ...formData, status: String(value) }),
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
