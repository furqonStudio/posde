import React, { useState } from 'react'
import { ReusableFormModal } from '../ReusableFormModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import type { Category } from '@/types'

interface AddCategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddCategoryFormModal: React.FC<AddCategoryFormModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
  })

  const queryClient = useQueryClient()

  const addCategoryMutation = useMutation({
    mutationFn: async (newCategory: Partial<Category>) => {
      await axios.post('http://localhost:8000/api/categories', newCategory)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onClose()
      toast.success('Category added successfully.')
    },
  })

  const handleSaveAdd = () => {
    addCategoryMutation.mutate(formData)
  }

  const formFields = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      value: formData.name || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, name: e.target.value }),
    },
  ]

  return (
    <ReusableFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSaveAdd}
      title="Add New Category"
      description="Enter the details for the new category."
      fields={formFields}
    />
  )
}
