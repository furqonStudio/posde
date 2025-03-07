'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'
import { formatCurrency } from '@/utils/format'
import type { Product } from '@/types'
import { ConfirmationAlert } from './ConfirmationAlert'
import { ReusableTable } from './ReusableTable'
import { ReusableFormModal } from './ReusableFormModal'

export function ProductsTable() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: { id: 0, name: '' },
    image: '',
  })
  const [searchQuery, setSearchQuery] = useState('')

  const queryClient = useQueryClient()
  const router = useRouter()

  // Fetch Products
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

  // Mutation untuk Add/Edit/Delete
  const addProductMutation = useMutation({
    mutationFn: async (newProduct: Partial<Product>) => {
      try {
        await axios.post('http://localhost:8000/api/products', newProduct)
      } catch (err) {
        console.log('🚀 ~ mutationFn: ~ err:', err)

        toast.error('Failed to add product.')
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsAddModalOpen(false)
      toast.success('Product added successfully.')
    },
  })

  const editProductMutation = useMutation({
    mutationFn: async (updatedProduct: Product) => {
      try {
        await axios.put(
          `http://localhost:8000/api/products/${updatedProduct.id}`,
          updatedProduct,
        )
      } catch (err) {
        toast.error('Failed to update product.')
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsEditModalOpen(false)
      toast.success('Product updated successfully.')
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

  // Handler
  const handleAdd = () => {
    setFormData({
      name: '',
      price: 0,
      category: { id: 0, name: '' },
      image: '',
    })
    setIsAddModalOpen(true)
  }

  const handleEdit = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedProduct(product)
    setFormData(product)
    setIsEditModalOpen(true)
  }

  const handleSaveAdd = () => {
    addProductMutation.mutate(formData)
  }

  const handleSaveEdit = () => {
    if (selectedProduct) {
      editProductMutation.mutate({ ...selectedProduct, ...formData })
    }
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
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue('price'))
        const formatted = formatCurrency(price)
        return <div className="text-right font-medium">{formatted}</div>
      },
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

  const formFields = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      value: formData.name,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, name: e.target.value }),
    },
    {
      id: 'price',
      label: 'Price',
      type: 'number',
      value: formData.price,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, price: Number(e.target.value) }),
    },
    {
      id: 'category',
      label: 'Category',
      type: 'text',
      value: formData.category?.name || 'Uncategorized',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({
          ...formData,
          category: {
            ...formData.category,
            id: formData.category?.id || 0,
            name: e.target.value || 'Uncategorized',
          },
        }),
    },
  ]

  const imageField = {
    id: 'image',
    label: 'Image',
    value: formData.image || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            image: reader.result as string,
          }))
        }
        reader.readAsDataURL(file)
      }
    },
    onRemove: () => {
      setFormData((prev) => ({
        ...prev,
        image: '',
      }))
    },
  }

  return (
    <div className="w-full">
      <ReusableTable
        title="Products"
        columns={columns}
        data={filteredProducts}
        onAdd={handleAdd}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onRowClick={(row) => router.push(`/products/${row.id}`)}
      />

      <ReusableFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAdd}
        title="Add New Product"
        description="Enter the details for the new product."
        fields={formFields}
        imageField={imageField}
      />
      <ReusableFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        title="Edit Product"
        description="Make changes to the product details here."
        fields={formFields}
        imageField={imageField}
      />

      <ConfirmationAlert
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onClick={confirmDelete}
      />
    </div>
  )
}
