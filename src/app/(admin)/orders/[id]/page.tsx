'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Download,
  Edit,
  Package,
  Pencil,
  User,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { orderData } from '@/data'
import { ConfirmationAlert } from '@/components/molecules/ConfirmationAlert'
import { Order, OrderItem } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { EditOrderFormModal } from '@/components/molecules/orders/EditOrderFormModal'
import { formatIndonesianDateTime } from '@/utils/format'

// Sample order data - in a real app, this would come from an API or database

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const queryClient = useQueryClient()
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:8000/api/orders/${orderId}`,
      )
      return data?.data
    },
  })
  console.log('🚀 ~ OrderDetailPage ~ order:', order)

  const handleEdit = () => {
    if (order) {
      setSelectedOrder(order)
    }
    setIsEditModalOpen(true)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  // Get payment status color
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  // Handle cancel order
  const handleCancelOrder = () => {
    // In a real app, this would make an API call to cancel the order
    alert(`Order ${order.id} has been cancelled`)
    setIsCancelDialogOpen(false)
  }

  // Handle print receipt
  const handlePrintReceipt = () => {
    // In a real app, this would generate a PDF or open a print dialog
    window.print()
  }

  if (error || !order) {
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-medium">Order #{order?.id}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handlePrintReceipt}>
              <Download className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            {order.status !== 'cancelled' && (
              <Button
                variant="destructive"
                onClick={() => setIsCancelDialogOpen(true)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="">
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Status</span>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Order Date
                </span>
                <span className="text-sm">
                  {formatIndonesianDateTime(order.created_at)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Order Time
                </span>
                <span className="text-sm">
                  {formatIndonesianDateTime(order.created_at)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Payment Status
                </span>
                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Payment Method
                </span>
                <span className="text-sm">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Total Amount
                </span>
                <span className="text-sm font-bold">{order.total}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}{' '}
              purchased
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item: OrderItem) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.product.name}
                    </TableCell>
                    <TableCell className="text-right">${item.price}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.price * item.quantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Subtotal</TableCell>
                  <TableCell className="text-right">
                    ${order.subtotal}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>Tax</TableCell>
                  <TableCell className="text-right">${order.tax}</TableCell>
                </TableRow>
                {order.discount > 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>Discount</TableCell>
                    <TableCell className="text-right">
                      -${order.discount}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell colSpan={3} className="font-bold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {order.total_price}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

        <ConfirmationAlert
          title="Cancel Order"
          description="Are you sure you want to cancel this order? This action cannot be undone."
          onClick={handleCancelOrder}
          open={isCancelDialogOpen}
          onOpenChange={setIsCancelDialogOpen}
          actionText="Yes, Cancel Order"
          cancelText="No, Keep Order"
        />

        <EditOrderFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          order={selectedOrder}
        />
      </div>
    </div>
  )
}
