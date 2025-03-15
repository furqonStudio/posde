'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil, Trash2, Calendar, Tag } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatIndonesianDateTime } from '@/utils/format'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { ConfirmationAlert } from '@/components/molecules/ConfirmationAlert'
import { EditProductFormModal } from '@/components/molecules/products/EditProductFormModal'
import { useState } from 'react'
import { Product } from '@/types'
import { toast } from 'sonner'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const queryClient = useQueryClient()

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:8000/api/products/${productId}`,
      )
      return data?.data
    },
  })

  const deleteProductMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`http://localhost:8000/api/products/${productId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsDeleteDialogOpen(false)
      toast.success('Product deleted successfully.')
      router.push('/products')
    },
  })

  const handleEdit = () => {
    if (product) {
      setSelectedProduct(product)
    }
    setIsEditModalOpen(true)
  }

  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteCategory = () => {
    deleteProductMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Loading Product...</h1>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you are looking for does not exist.
        </p>
        <Button onClick={() => router.push('/products')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full overflow-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-medium">Product Details</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-fit">
          <CardContent>
            {product.images?.length ? (
              <div className="overflow-hidden rounded-lg border bg-white">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="aspect-square h-auto w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500">
                No Image Available
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>Product ID: {product.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-primary text-lg font-bold">
                  Rp {product.price?.toLocaleString('id-ID')}
                </span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  In Stock: {product.stock}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Tag className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">Category:</span>
                <Badge variant="outline">{product.category.name}</Badge>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 font-medium">Description</h3>
                <p className="text-muted-foreground text-sm">
                  {product.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">Created At:</span>
                <span className="text-muted-foreground text-sm">
                  {formatIndonesianDateTime(product.created_at)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">Updated At:</span>
                <span className="text-muted-foreground text-sm">
                  {formatIndonesianDateTime(product.updated_at)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <ConfirmationAlert
          title="Delete Product"
          description="Are you sure you want to delete this product? This action cannot be undone."
          onClick={handleDeleteCategory}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          actionText="Yes, Delete Product"
          cancelText="No, Keep Product"
        />
        <EditProductFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={selectedProduct}
        />
      </div>
    </div>
  )
}
