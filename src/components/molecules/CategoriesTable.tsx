'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import type { Category } from '@/types'
import { ConfirmationAlert } from './ConfirmationAlert'
import { ReusableTable } from './ReusableTable'
import { ReusableFormModal } from './ReusableFormModal'

export function CategoriesTable() {
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
  const [searchQuery, setSearchQuery] = useState('')

  const queryClient = useQueryClient()
  const router = useRouter()

  // Fetch Categories
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:8000/api/categories')
      return data?.data ?? []
    },
  })

  // Mutation untuk Add/Edit/Delete
  const addCategoryMutation = useMutation({
    mutationFn: async (newCategory: Partial<Category>) => {
      await axios.post('http://localhost:8000/api/categories', newCategory)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsAddModalOpen(false)
      toast.success('Category added successfully.')
    },
  })

  const editCategoryMutation = useMutation({
    mutationFn: async (updatedCategory: Category) => {
      await axios.put(
        `http://localhost:8000/api/categories/${updatedCategory.id}`,
        updatedCategory,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsEditModalOpen(false)
      toast.success('Category updated successfully.')
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      await axios.delete(`http://localhost:8000/api/categories/${categoryId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsDeleteModalOpen(false)
      toast.error('Category deleted successfully.')
    },
  })

  // Handler
  const handleAdd = () => {
    setFormData({ id: 0, name: '' })
    setIsAddModalOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setFormData(category)
    setIsEditModalOpen(true)
  }

  const handleSaveAdd = () => {
    addCategoryMutation.mutate(formData)
  }

  const handleSaveEdit = () => {
    if (selectedCategory) {
      editCategoryMutation.mutate({ ...selectedCategory, ...formData })
    }
  }

  const handleDelete = (categoryId: number) => {
    const category = categories.find((cat: Category) => cat.id === categoryId)
    if (category) {
      setSelectedCategory(category)
      setIsDeleteModalOpen(true)
    }
  }

  const confirmDelete = () => {
    if (selectedCategory) {
      deleteCategoryMutation.mutate(selectedCategory.id)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase())
  }

  const filteredCategories = categories.filter((category: Category) =>
    category.name.toLowerCase().includes(searchQuery),
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
      cell: ({ row }) => <div>{row.original.products.length}</div>,
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
        data={filteredCategories}
        onAdd={handleAdd}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onRowClick={(row) => router.push(`/categories/${row.id}`)}
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
        onClick={confirmDelete}
      />
    </div>
  )
}
