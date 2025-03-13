'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlignJustify, ArrowLeft, Package, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { ConfirmationAlert } from '@/components/molecules/ConfirmationAlert'
import { ReusableFormModal } from '@/components/molecules/ReusableFormModal'
import type { Category, Product } from '@/types'

export default function CategoryDetailPage() {
  const router = useRouter()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Data Dummy
  const [category, setCategory] = useState<Category>({
    id: 1,
    name: 'Electronics',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    products: [
      {
        id: 1,
        name: 'Laptop',
        price: 1200,
        stock: 10,
        description: 'A high-performance laptop',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: { id: 1, name: 'test' },
      },
      {
        id: 2,
        name: 'Smartphone',
        price: 800,
        stock: 15,
        description: 'A latest model smartphone',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: { id: 1, name: 'test' },
      },
      {
        id: 3,
        name: 'Headphones',
        price: 150,
        stock: 25,
        description: 'Noise-cancelling headphones',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: { id: 1, name: 'test' },
      },
    ],
  })

  const [formData, setFormData] = useState<Partial<Category>>({
    id: category.id,
    name: category.name,
  })

  const handleSaveEdit = () => {
    setCategory((prev) => ({
      ...prev,
      name: formData.name || prev.name,
      updated_at: new Date().toISOString(),
    }))
    setIsEditModalOpen(false)
    toast.success('Category updated successfully.')
  }

  const handleDeleteCategory = () => {
    toast.success('Category deleted successfully.')
    router.push('/categories')
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
    <div className="w-full overflow-auto p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-medium">{category.name}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlignJustify className="mr-2 h-5 w-5" />
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Name</span>
              <span className="text-sm">{category.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Created At</span>
              <span className="text-sm">
                {new Date(category.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Updated At</span>
              <span className="text-sm">
                {new Date(category.updated_at).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" /> Products
            </CardTitle>
            <CardDescription>
              {category.products.length}{' '}
              {category.products.length === 1 ? 'product' : 'products'} in this
              category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {category.products.map((product: Product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-right">
                      ${product.price ? product.price.toFixed(2) : '0.00'}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.stock}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <ConfirmationAlert
          title="Delete Category"
          description="Are you sure you want to delete this category? This action cannot be undone."
          onClick={handleDeleteCategory}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          actionText="Yes, Delete Category"
          cancelText="No, Keep Category"
        />
        <ReusableFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
          title="Edit Category"
          description="Make changes to the category details here."
          fields={formFields}
        />
      </div>
    </div>
  )
}
