import React, { useState, useEffect } from 'react'
import { ReusableFormModal } from '../ReusableFormModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import type { Category, Order } from '@/types'

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

  const EditOrderMutation = useMutation({
    mutationFn: async (updateOrder: Order) => {
      await axios.put(
        `http://localhost:8000/api/categories/${updateOrder.id}`,
        updateOrder,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['order', String(order?.id)],
      })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      onClose()
      toast.success('Category updated successfully.')
    },
  })

  const handleSaveEdit = () => {
    if (order) {
      EditOrderMutation.mutate({ ...order, ...formData })
    }
  }

  const formFields = [
    {
      id: 'status',
      label: 'Status',
      type: 'text',
      value: formData.status,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, status: e.target.value }),
    },
  ]

  return (
    <ReusableFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSaveEdit}
      title="Edit Category"
      description="Make changes to the category details here."
      fields={formFields}
    />
  )
}
