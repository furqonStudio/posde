'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { toast } from 'sonner'

import { useState } from 'react'
import { CategoryFormModal } from './CategoryFormModal'
import type { Category } from '@/types'
import { categories as initialCategories } from '@/data'
import { ConfirmationAlert } from './ConfirmationAlert'
import { ReusableTable } from './ReusableTable'

export function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )

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
      size: 50,
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
    setIsAddModalOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsEditModalOpen(true)
  }

  const handleSaveAdd = (newCategory: Partial<Category>) => {
    const categoryToAdd = {
      ...newCategory,
      id: categories.length + 1,
    } as Category

    setCategories([...categories, categoryToAdd])
    setIsAddModalOpen(false)
    toast.success('Category added', {
      description: `${newCategory.name} has been added successfully.`,
    })
  }

  const handleSaveEdit = (updatedCategory: Partial<Category>) => {
    if (!selectedCategory) return

    const updatedCategories = categories.map((category) => {
      if (category.id === selectedCategory.id) {
        return {
          ...category,
          ...updatedCategory,
        }
      }
      return category
    })

    setCategories(updatedCategories)
    setIsEditModalOpen(false)
    toast.success('Category updated', {
      description: `${updatedCategory.name} has been updated successfully.`,
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

  return (
    <div className="w-full">
      <ReusableTable
        title="Categories"
        columns={columns}
        data={categories}
        onAdd={handleAdd}
      />

      <CategoryFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAdd}
        title="Add New Category"
        description="Enter the details for the new category."
      />
      <CategoryFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        category={selectedCategory || undefined}
        title="Edit Category"
        description="Make changes to the category details here."
      />
      {/* Delete Confirmation Dialog */}
      <ConfirmationAlert
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        selectedName={selectedCategory}
        onClick={confirmDelete}
      />
    </div>
  )
}
