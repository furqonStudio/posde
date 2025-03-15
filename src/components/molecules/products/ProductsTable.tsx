'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import type { Product } from '@/types'
import { formatIndonesianCurrency } from '@/utils/format'
import Image from 'next/image'
import { toast } from 'sonner'
import { ConfirmationAlert } from '../ConfirmationAlert'
import { ReusableTable } from '../ReusableTable'
import { AddProductFormModal } from './AddProductFormModal'
import { EditProductFormModal } from './EditProductFormModal'

export function ProductsTable() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [searchQuery, setSearchQuery] = useState('')

  const queryClient = useQueryClient()
  const router = useRouter()

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get(
        'http://localhost:8000/api/products?per_page=all',
      )
      return data?.data ?? []
    },
  })

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      try {
        await axios.delete(`http://localhost:8000/api/products/${productId}`)
      } catch (err) {
        toast.error('Failed to delete product.')
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsDeleteModalOpen(false)
      toast.success('Product deleted successfully.')
    },
  })

  const handleAdd = () => {
    setIsAddModalOpen(true)
  }

  const handleEdit = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleDelete = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const product = products.find((prod: Product) => prod.id === productId)
    if (product) {
      setSelectedProduct(product)
      setIsDeleteModalOpen(true)
    }
  }

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProductMutation.mutate(selectedProduct.id)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase())
  }

  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchQuery),
  )

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'image',
      size: 50,
      header: 'Image',
      cell: ({ row }) => (
        <Image
          src={row.getValue('image') || '/placeholder.svg'}
          alt={row.getValue('name')}
          width={32}
          height={32}
          className="m-auto rounded-sm"
        />
      ),
    },
    {
      accessorKey: 'name',
      minSize: 200,
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
      accessorKey: 'price',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          {formatIndonesianCurrency(row.getValue('price'))}
        </div>
      ),
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => (
        <div className="text-right">{row.getValue('stock')}</div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const category = row.getValue('category') as {
          id: number
          name: string
        }
        return <div>{category?.name || 'Uncategorized'}</div>
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Actions',
      size: 80,
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleEdit(product, e)}
            >
              <Pencil className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleDelete(product.id, e)}
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
      {error && (
        <div className="mb-4 text-red-500">
          Error loading products: {error.message}
        </div>
      )}
      <ReusableTable
        title="Products"
        columns={columns}
        data={filteredProducts}
        onAdd={handleAdd}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onRowClick={(row) => router.push(`/products/${row.id}`)}
      />

      <AddProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
      />

      <ConfirmationAlert
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onClick={confirmDelete}
      />
    </div>
  )
}
