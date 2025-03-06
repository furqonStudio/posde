'use client'

import { ReusableTable } from './ReusableTable'
import { useState } from 'react'
import { ConfirmationAlert } from './ConfirmationAlert'
import { toast } from 'sonner'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/format'
import type { Order } from '@/types'
import { orders as initialOrders } from '@/data'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { ReusableFormModal } from './ReusableFormModal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [formData, setFormData] = useState<Partial<Order>>({
    id: 0,
    totalPrice: 0,
    status: '',
    items: 0,
    createdAt: '',
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 50,
      cell: ({ row }) => <div>{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'totalPrice',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const totalPrice = Number.parseFloat(row.getValue('totalPrice'))
        const formatted = formatCurrency(totalPrice)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 80,
      cell: ({ row }) => <div>{row.getValue('status')}</div>,
    },
    {
      accessorKey: 'items',
      header: 'Items',
      size: 50,
      cell: ({ row }) => <div>{row.getValue('items')}</div>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => (
        <div>{new Date(row.getValue('createdAt')).toLocaleDateString()}</div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Actions',
      size: 80,
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="flex justify-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(order)}>
              <Pencil className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(order.id)}
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
      id: 0,
      totalPrice: 0,
      status: '',
      items: 0,
      createdAt: '',
    })
    setIsAddModalOpen(true)
  }

  const handleEdit = (order: Order) => {
    setSelectedOrder(order)
    setFormData(order)
    setIsEditModalOpen(true)
  }

  const handleSaveAdd = () => {
    const orderToAdd = {
      ...formData,
      id: orders.length + 1,
      totalPrice: Number(formData.totalPrice),
      createdAt: new Date().toISOString(),
    } as Order

    setOrders([...orders, orderToAdd])
    setFilteredOrders([...orders, orderToAdd])
    setIsAddModalOpen(false)
    toast.success('Order added', {
      description: `Order ${formData.id} has been added successfully.`,
    })
  }

  const handleSaveEdit = () => {
    if (!selectedOrder) return

    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          ...formData,
          totalPrice: Number(formData.totalPrice),
        }
      }
      return order
    })

    setOrders(updatedOrders)
    setFilteredOrders(updatedOrders)
    setIsEditModalOpen(false)
    toast.success('Order updated', {
      description: `Order ${formData.id} has been updated successfully.`,
    })
  }

  const handleDelete = (orderId: number) => {
    const order = orders.find((order) => order.id === orderId)
    if (order) {
      setSelectedOrder(order)
      setIsDeleteModalOpen(true)
    }
  }

  const confirmDelete = () => {
    if (!selectedOrder) return

    const updatedOrders = orders.filter(
      (order) => order.id !== selectedOrder.id,
    )
    setOrders(updatedOrders)
    setFilteredOrders(updatedOrders)
    setIsDeleteModalOpen(false)
    toast.success('Order deleted', {
      description: `Order ${selectedOrder.id} has been deleted successfully.`,
    })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    filterOrders(query, statusFilter)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    filterOrders(searchQuery, value)
  }

  const filterOrders = (query: string, status: string) => {
    const filtered = orders.filter(
      (order) =>
        ['id', 'status', 'createdAt'].some((key) =>
          order[key as keyof Order].toString().toLowerCase().includes(query),
        ) &&
        (status !== 'all'
          ? order.status.toLowerCase() === status.toLowerCase()
          : true),
    )
    setFilteredOrders(filtered)
  }

  const formFields = [
    {
      id: 'totalPrice',
      label: 'Total Price',
      type: 'number',
      value: formData.totalPrice,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, totalPrice: Number(e.target.value) }),
    },
    {
      id: 'status',
      label: 'Status',
      type: 'text',
      value: formData.status,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, status: e.target.value }),
    },
    {
      id: 'items',
      label: 'Items',
      type: 'number',
      value: formData.items,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, items: Number(e.target.value) }),
    },
    {
      id: 'createdAt',
      label: 'Created At',
      type: 'text',
      value: formData.createdAt,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, createdAt: e.target.value }),
    },
  ]

  return (
    <div className="w-full">
      <ReusableTable
        title="Orders"
        columns={columns}
        data={filteredOrders}
        onAdd={handleAdd}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        filterComponent={
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Success">Success</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <ReusableFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAdd}
        title="Add New Order"
        description="Enter the details for the new order."
        fields={formFields}
      />

      <ReusableFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        title="Edit Order"
        description="Make changes to the order details here."
        fields={formFields}
      />

      <ConfirmationAlert
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onClick={confirmDelete}
      />
    </div>
  )
}
