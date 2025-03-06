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
  User,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// Sample order data - in a real app, this would come from an API or database
const orderData = {
  'order-1001': {
    id: '1001',
    date: '2023-06-15T14:30:00',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 890',
    },
    status: 'Completed',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    items: [
      { id: 1, name: 'Coffee', price: 3.99, quantity: 2 },
      { id: 3, name: 'Chocolate Cake', price: 4.5, quantity: 1 },
      { id: 4, name: 'Green Tea', price: 2.99, quantity: 1 },
    ],
    subtotal: 15.47,
    tax: 1.55,
    discount: 0,
    total: 17.02,
  },
  'order-1002': {
    id: '1002',
    date: '2023-06-16T10:15:00',
    customer: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 987 654 321',
    },
    status: 'Processing',
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    items: [
      { id: 2, name: 'Sandwich', price: 5.99, quantity: 3 },
      { id: 5, name: 'Croissant', price: 2.5, quantity: 2 },
      { id: 8, name: 'Cheesecake', price: 4.99, quantity: 1 },
    ],
    subtotal: 27.96,
    tax: 2.8,
    discount: 2.5,
    total: 28.26,
  },
  'order-1003': {
    id: '1003',
    date: '2023-06-16T16:45:00',
    customer: {
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      phone: '+1 555 123 456',
    },
    status: 'Pending',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Pending',
    items: [
      { id: 6, name: 'Orange Juice', price: 3.5, quantity: 2 },
      { id: 9, name: 'Caesar Salad', price: 6.5, quantity: 1 },
      { id: 10, name: 'Cappuccino', price: 4.25, quantity: 2 },
    ],
    subtotal: 21.5,
    tax: 2.15,
    discount: 0,
    total: 23.65,
  },
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  // Get order data based on ID
  const order = orderData[`order-${orderId}`]

  // Handle if order not found
  if (!order) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The order you are looking for does not exist.
        </p>
        <Button onClick={() => router.push('/orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>
    )
  }

  // Format date
  const formattedDate = new Date(order.date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Get status color
  const getStatusColor = (status) => {
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
  const getPaymentStatusColor = (status) => {
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

  return (
    <div className="w-full overflow-auto p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-medium">Order #{order.id}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handlePrintReceipt}>
              <Download className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
            {order.status !== 'Cancelled' && (
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
                  {new Date(order.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Order Time
                </span>
                <span className="text-sm">
                  {new Date(order.date).toLocaleTimeString()}
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
                  Payment Method
                </span>
                <span className="text-sm">{order.paymentMethod}</span>
              </div>
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
                  Total Amount
                </span>
                <span className="text-sm font-bold">
                  ${order.total.toFixed(2)}
                </span>
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
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">
                      ${item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Subtotal</TableCell>
                  <TableCell className="text-right">
                    ${order.subtotal.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>Tax</TableCell>
                  <TableCell className="text-right">
                    ${order.tax.toFixed(2)}
                  </TableCell>
                </TableRow>
                {order.discount > 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>Discount</TableCell>
                    <TableCell className="text-right">
                      -${order.discount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell colSpan={3} className="font-bold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    ${order.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

        {/* Cancel Order Confirmation Dialog */}
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCancelDialogOpen(false)}
              >
                No, Keep Order
              </Button>
              <Button variant="destructive" onClick={handleCancelOrder}>
                Yes, Cancel Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
