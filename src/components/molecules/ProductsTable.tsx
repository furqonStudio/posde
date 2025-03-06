'use client'

import { ReusableTable } from './ReusableTable'
import { useState } from 'react'
import { ConfirmationAlert } from './ConfirmationAlert'
import { toast } from 'sonner'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { formatCurrency } from '@/utils/format'
import type { Product } from '@/types'
import { products as initialProducts } from '@/data'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { ReusableFormModal } from './ReusableFormModal'

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: '',
    image: '',
  })

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
      cell: ({ row }) => <div>{row.getValue('category')}</div>,
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
              onClick={() => handleEdit(product)}
            >
              <Pencil className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(product.id)}
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
      name: '',
      price: 0,
      category: '',
      image: '',
    })
    setIsAddModalOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setFormData(product)
    setIsEditModalOpen(true)
  }

  const handleSaveAdd = () => {
    const productToAdd = {
      ...formData,
      id: products.length + 1,
      price: Number(formData.price),
    } as Product

    setProducts([...products, productToAdd])
    setIsAddModalOpen(false)
    toast.success('Product added', {
      description: `${formData.name} has been added successfully.`,
    })
  }

  const handleSaveEdit = () => {
    if (!selectedProduct) return

    const updatedProducts = products.map((product) => {
      if (product.id === selectedProduct.id) {
        return {
          ...product,
          ...formData,
          price: Number(formData.price),
        }
      }
      return product
    })

    setProducts(updatedProducts)
    setIsEditModalOpen(false)
    toast.success('Product updated', {
      description: `${formData.name} has been updated successfully.`,
    })
  }

  const handleDelete = (productId: number) => {
    const product = products.find((product) => product.id === productId)
    if (product) {
      setSelectedProduct(product)
      setIsDeleteModalOpen(true)
    }
  }

  const confirmDelete = () => {
    if (!selectedProduct) return

    const updatedProducts = products.filter(
      (product) => product.id !== selectedProduct.id,
    )
    setProducts(updatedProducts)
    setIsDeleteModalOpen(false)
    toast.success('Product deleted', {
      description: `${selectedProduct.name} has been deleted successfully.`,
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
      value: formData.category,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, category: e.target.value }),
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
        data={products}
        onAdd={handleAdd}
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
        selectedName={selectedProduct}
        onClick={confirmDelete}
      />
    </div>
  )
}
