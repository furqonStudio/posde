'use client'

import { ReusableTable } from '../ReusableTable'
import { useState } from 'react'
import { ConfirmationAlert } from '../ConfirmationAlert'
import { toast } from 'sonner'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import type { Order } from '@/types'
import { orders as initialOrders } from '@/data'
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react'
import { ReusableFormModal } from '../ReusableFormModal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { useRouter } from 'next/navigation'
import { EditOrderFormModal } from './EditOrderFormModal'

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const router = useRouter()

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
      cell: ({ row }) => <div>{row.getValue('totalPrice')}</div>,
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

  const handleEdit = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedOrder(order)
    setIsEditModalOpen(true)
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

  return (
    <div className="w-full">
      <ReusableTable
        title="Orders"
        columns={columns}
        data={filteredOrders}
        onAdd={() => router.push('/menu')}
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

      <EditOrderFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  )
}
