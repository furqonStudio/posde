'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import type { Category } from '@/types'
import { ConfirmationAlert } from '../ConfirmationAlert'
import { ReusableTable } from '../ReusableTable'
import { useState } from 'react'
import { AddCategoryFormModal } from './AddCategoryFormModal'
import { EditCategoryFormModal } from './EditCategoryFormModal'
import { formatIndonesianDateTime } from '@/utils/format'
import { LoadingState } from '../LoadingState'
import { ErrorState } from '../ErrorState'

export function CategoriesTable() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const [searchQuery, setSearchQuery] = useState('')

  const queryClient = useQueryClient()
  const router = useRouter()

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

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      await axios.delete(`http://localhost:8000/api/categories/${categoryId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsDeleteModalOpen(false)
      toast.success('Category deleted successfully.')
    },
  })

  const handleAdd = () => {
    setIsAddModalOpen(true)
  }

  const handleEdit = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedCategory(category)
    setIsEditModalOpen(true)
  }

  const handleDelete = (categoryId: number, e: React.MouseEvent) => {
    e.stopPropagation()
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
      cell: ({ row }) => (
        <div className="text-center">{row.original.products.length}</div>
      ),
    },
    {
      accessorKey: 'created_at',
      minSize: 170,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {formatIndonesianDateTime(row.getValue('created_at'))}
        </div>
      ),
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
              onClick={(e) => handleEdit(category, e)}
            >
              <Pencil className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleDelete(category.id, e)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )
      },
    },
  ]

  if (isLoading) return <LoadingState />

  if (error) return <ErrorState />

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

      <AddCategoryFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditCategoryFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={selectedCategory}
      />

      <ConfirmationAlert
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onClick={confirmDelete}
      />
    </div>
  )
}
