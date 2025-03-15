import React, { useState, useEffect } from 'react'
import { ReusableFormModal } from '../ReusableFormModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import type { Category, Product } from '@/types'

interface EditProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export const EditProductFormModal: React.FC<EditProductFormModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [formData, setFormData] = useState<Partial<Category>>({
    id: 0,
    name: '',
  })

  useEffect(() => {
    if (product) {
      setFormData(product)
    }
  }, [product])

  const queryClient = useQueryClient()

  const EditProductMutation = useMutation({
    mutationFn: async (updatedCategory: Category) => {
      await axios.put(
        `http://localhost:8000/api/categories/${updatedCategory.id}`,
        updatedCategory,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onClose()
      toast.success('Category updated successfully.')
    },
  })

  const handleSaveEdit = () => {
    if (category) {
      EditProductMutation.mutate({ ...category, ...formData })
    }
  }

  const formFields = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      value: formData.name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, name: e.target.value }),
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
