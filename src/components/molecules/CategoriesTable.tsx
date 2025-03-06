'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { toast } from 'sonner'

import { useState } from 'react'
import type { Category } from '@/types'
import { categories as initialCategories } from '@/data'
import { ConfirmationAlert } from './ConfirmationAlert'
import { ReusableTable } from './ReusableTable'
import { ReusableFormModal } from './ReusableFormModal'

export function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const [formData, setFormData] = useState<Partial<Category>>({
    id: 0,
    name: '',
  })

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'products',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Products
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue('products')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Actions',
      size: 80,
      cell: ({ row }) => {
        const category = row.original
        return (
          <div className="flex justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(category)}
            >
              <Pencil className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(category.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )
      },
    },
  ]

  const handleAdd = () => {
    setFormData({
      id: 0,
      name: '',
    })
    setIsAddModalOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setFormData(category)
    setIsEditModalOpen(true)
  }

  const handleSaveAdd = () => {
    const categoryToAdd = {
      ...formData,
      id: categories.length + 1,
    } as Category

    setCategories([...categories, categoryToAdd])
    setIsAddModalOpen(false)
    toast.success('Category added', {
      description: `${formData.name} has been added successfully.`,
    })
  }

  const handleSaveEdit = () => {
    if (!selectedCategory) return

    const updatedCategories = categories.map((category) => {
      if (category.id === selectedCategory.id) {
        return {
          ...category,
          ...formData,
        }
      }
      return category
    })

    setCategories(updatedCategories)
    setIsEditModalOpen(false)
    toast.success('Category updated', {
      description: `${formData.name} has been updated successfully.`,
    })
  }

  const handleDelete = (categoryId: number) => {
    const category = categories.find((category) => category.id === categoryId)
    if (category) {
      setSelectedCategory(category)
      setIsDeleteModalOpen(true)
    }
  }

  const confirmDelete = () => {
    if (!selectedCategory) return

    const updatedCategories = categories.filter(
      (category) => category.id !== selectedCategory.id,
    )
    setCategories(updatedCategories)
    setIsDeleteModalOpen(false)
    toast.error('Category deleted', {
      description: `${selectedCategory.name} has been deleted successfully.`,
    })
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
    <div className="w-full">
      <ReusableTable
        title="Categories"
        columns={columns}
        data={categories}
        onAdd={handleAdd}
      />

      <ReusableFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAdd}
        title="Add New Category"
        description="Enter the details for the new category."
        fields={formFields}
      />

      <ReusableFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        title="Edit Category"
        description="Make changes to the category details here."
        fields={formFields}
      />

      <ConfirmationAlert
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        selectedName={selectedCategory}
        onClick={confirmDelete}
      />
    </div>
  )
}
