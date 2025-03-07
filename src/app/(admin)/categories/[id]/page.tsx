'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Package, Pencil, Trash2 } from 'lucide-react'
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

export default function CategoryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  // Fetch category data based on ID
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

  // Mutation for deleting category
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      await axios.delete(`http://localhost:8000/api/categories/${categoryId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsDeleteDialogOpen(false)
      toast.success('Category deleted successfully.')
      router.push('/categories')
    },
  })

  // Handle delete category
  const handleDeleteCategory = () => {
    deleteCategoryMutation.mutate(Number(categoryId))
  }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Loading...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Error loading category</h1>
        <p className="text-muted-foreground mb-6">
          There was an error loading the category. Please try again later.
        </p>
        <Button onClick={() => router.push('/categories')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Category Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The category you are looking for does not exist.
        </p>
        <Button onClick={() => router.push('/categories')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full overflow-auto p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-medium">Category: {category.name}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/categories/edit/${category.id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Category
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Category
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Category Details
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
            <CardTitle>Products</CardTitle>
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
                      ${product.price.toFixed(2)}
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
      </div>
    </div>
  )
}
