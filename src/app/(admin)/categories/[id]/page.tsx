'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
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
import type { Category, Product } from '@/types'

export default function CategoryDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  // Fetch kategori berdasarkan id
  const {
    data: category,
    isLoading,
    isError,
  } = useQuery<Category>({
    queryKey: ['category', id],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:8000/api/categories/${id}`,
      )
      console.log('🚀 ~ queryFn: ~ data.data:', data.data)

      return data.data
    },
  })

  // Mutasi untuk menghapus kategori
  const deleteCategoryMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`http://localhost:8000/api/categories/${id}`)
    },
    onSuccess: () => {
      toast.success('Category deleted successfully.')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      router.push('/categories')
    },
    onError: () => {
      toast.error('Failed to delete category.')
    },
  })

  // Mutasi untuk menghapus produk dari kategori
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      await axios.delete(`http://localhost:8000/api/products/${productId}`)
    },
    onSuccess: () => {
      toast.success('Product deleted successfully.')
      queryClient.invalidateQueries({ queryKey: ['category', id] })
    },
    onError: () => {
      toast.error('Failed to delete product.')
    },
  })

  if (isLoading) return <p>Loading...</p>
  if (isError || !category) return <p>Failed to load category.</p>

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
            <Button
              variant="outline"
              onClick={() => router.push(`/categories/edit/${category.id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {category.products.map((product: Product) => (
                  <TableRow
                    key={product.id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-right">
                      ${product.price}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.stock}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setProductToDelete(product)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Konfirmasi Hapus Kategori */}
        <ConfirmationAlert
          title="Delete Category"
          description="Are you sure you want to delete this category? This action cannot be undone."
          onClick={() => deleteCategoryMutation.mutate()}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          actionText="Yes, Delete Category"
          cancelText="No, Keep Category"
        />

        {/* Konfirmasi Hapus Produk */}
        {productToDelete && (
          <ConfirmationAlert
            title="Delete Product"
            description={`Are you sure you want to delete ${productToDelete.name}? This action cannot be undone.`}
            onClick={() => {
              deleteProductMutation.mutate(productToDelete.id)
              setProductToDelete(null)
            }}
            open={Boolean(productToDelete)}
            onOpenChange={() => setProductToDelete(null)}
            actionText="Yes, Delete Product"
            cancelText="No, Keep Product"
          />
        )}
      </div>
    </div>
  )
}
