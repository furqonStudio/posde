'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import type { Category } from '@/types'
import { ConfirmationAlert } from './ConfirmationAlert'
import { ReusableTable } from './ReusableTable'

const dummyCategories: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    products: [
      {
        id: 8,
        name: 'Id non.',
        price: 240.36,
        stock: 96,
        description: null,
        created_at: '2025-03-04T05:55:48.000000Z',
        updated_at: '2025-03-04T05:55:48.000000Z',
      },
    ],
    created_at: 'mim',
    updated_at: 'nun',
  },
]

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get('http://localhost:8000/api/categories')
  return data.data
}

export function CategoriesTable() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const [searchQuery, setSearchQuery] = useState('')

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      await axios.delete(`http://localhost:8000/api/categories/${categoryId}`)
    },
    onSuccess: () => {
      toast.error('Category deleted', {
        description: `${selectedCategory?.name} has been deleted successfully.`,
      })
      queryClient.invalidateQueries({ queryKey: ['categories'] }) // Refresh categories list
      setIsDeleteModalOpen(false)
    },
    onError: (error) => {
      toast.error('Failed to delete category', {
        description:
          error instanceof Error ? error.message : 'Something went wrong',
      })
    },
  })

  const handleDelete = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (selectedCategory) {
      deleteCategoryMutation.mutate(selectedCategory.id)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase())
  }

  const filteredCategories =
    categories?.filter((category) =>
      category.name.toLowerCase().includes(searchQuery),
    ) || []

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
      accessorKey: 'created_at',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue('created_at')}</div>,
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
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(category)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="w-full">
      {isLoading && <p>Loading categories...</p>}
      {isError && <p className="text-red-500">Error: {error?.message}</p>}

      {!isLoading && !isError && (
        <ReusableTable
          title="Categories"
          columns={columns}
          data={filteredCategories}
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          onAdd={() => router.push('/categories/add')}
        />
      )}

      <ConfirmationAlert
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        selectedName={selectedCategory}
        onClick={confirmDelete}
      />
    </div>
  )
}
