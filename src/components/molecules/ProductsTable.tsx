'use client'

import { ReusableTable } from './ReusableTable'
import { ProductFormModal } from './ProductFormModal'
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

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'image',
      header: 'Image',
      size: 100,
      cell: ({ row }) => (
        <Image
          src={row.getValue('image') || '/placeholder.svg'}
          alt={row.getValue('name')}
          width={32}
          height={32}
          className="rounded-sm"
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
      size: 200,
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
      size: 100,
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue('price'))
        const formatted = formatCurrency(price)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      size: 150,
      cell: ({ row }) => <div>{row.getValue('category')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Actions',
      size: 100,
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
    setIsAddModalOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleSaveAdd = (newProduct: Partial<Product>) => {
    const productToAdd = {
      ...newProduct,
      id: products.length + 1,
      price: Number(newProduct.price),
    } as Product

    setProducts([...products, productToAdd])
    setIsAddModalOpen(false)
    toast.success('Product added', {
      description: `${newProduct.name} has been added successfully.`,
    })
  }

  const handleSaveEdit = (updatedProduct: Partial<Product>) => {
    if (!selectedProduct) return

    const updatedProducts = products.map((product) => {
      if (product.id === selectedProduct.id) {
        return {
          ...product,
          ...updatedProduct,
          price: Number(updatedProduct.price),
        }
      }
      return product
    })

    setProducts(updatedProducts)
    setIsEditModalOpen(false)
    toast.success('Product updated', {
      description: `${updatedProduct.name} has been updated successfully.`,
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

  return (
    <div className="w-full">
      <ReusableTable columns={columns} data={products} onAdd={handleAdd} />
      {/* Add Modal */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAdd}
        title="Add New Product"
        description="Enter the details for the new product."
      />

      {/* Edit Modal */}
      <ProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        product={selectedProduct || undefined}
        title="Edit Product"
        description="Make changes to the product details here."
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
