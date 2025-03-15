import React, { useState, useEffect } from 'react'
import { ReusableFormModal } from '../ReusableFormModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import type { Category } from '@/types'

interface EditCategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  category: Category | null
}

export const EditCategoryFormModal: React.FC<EditCategoryFormModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const [formData, setFormData] = useState<Partial<Category>>({
    id: 0,
    name: '',
  })

  useEffect(() => {
    if (category) {
      setFormData(category)
    }
  }, [category])

  const queryClient = useQueryClient()

  const editCategoryMutation = useMutation({
    mutationFn: async (updatedCategory: Category) => {
      await axios.put(
        `http://localhost:8000/api/categories/${updatedCategory.id}`,
        updatedCategory,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['category', String(category?.id)],
      })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onClose()
      toast.success('Category updated successfully.')
    },
  })

  const handleSaveEdit = () => {
    if (category) {
      editCategoryMutation.mutate({ ...category, ...formData })
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
