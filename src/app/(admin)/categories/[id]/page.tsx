'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ConfirmationAlert } from '@/components/molecules/ConfirmationAlert'
import type { Category, Product } from '@/types'
import {
  formatIndonesianCurrency,
  formatIndonesianDateTime,
} from '@/utils/format'
import { EditCategoryFormModal } from '@/components/molecules/categories/EditCategoryFormModal'

export default function CategoryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )
  const queryClient = useQueryClient()

  const {
    data: category,
    isLoading,
    error,
  } = useQuery<Category>({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:8000/api/categories/${categoryId}`,
      )
      return data?.data
    },
  })
  console.log('🚀 ~ CategoryDetailPage ~ categoryId:', categoryId)

  const deleteCategoryMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`http://localhost:8000/api/categories/${categoryId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsDeleteDialogOpen(false)
      toast.success('Category deleted successfully.')
      router.push('/categories')
    },
  })

  const handleEdit = () => {
    if (category) {
      setSelectedCategory(category)
    }
    setIsEditModalOpen(true)
  }

  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteCategory = () => {
    deleteCategoryMutation.mutate()
  }

  return (
    <div className="w-full overflow-auto p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-medium">{category?.name}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
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
              <span className="text-sm">{category?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Created At</span>
              <span className="text-sm">
                {category?.created_at
                  ? formatIndonesianDateTime(category.created_at)
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Updated At</span>
              <span className="text-sm">
                {category?.updated_at
                  ? formatIndonesianDateTime(category.updated_at)
                  : 'N/A'}
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
              {category?.products.length}{' '}
              {category?.products.length === 1 ? 'product' : 'products'} in this
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
                {category?.products.map((product: Product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatIndonesianCurrency(product.price ?? 0)}
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
        <EditCategoryFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          category={selectedCategory}
        />
      </div>
    </div>
  )
}
