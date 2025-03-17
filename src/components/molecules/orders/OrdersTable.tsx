'use client'

import { Button } from '@/components/ui/button'
import type { Order } from '@/types'
import {
  formatIndonesianCurrency,
  formatIndonesianDateTime,
} from '@/utils/format'
import { useQuery } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import axios from 'axios'
import { ArrowUpDown, Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { ErrorState } from '../ErrorState'
import { LoadingState } from '../LoadingState'
import { ReusableTable } from '../ReusableTable'
import { EditOrderFormModal } from './EditOrderFormModal'

export function OrdersTable() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const router = useRouter()

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:8000/api/orders')
      return data?.data ?? []
    },
  })

  // 🔥 Handle Edit Order
  const handleEdit = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedOrder(order)
    setIsEditModalOpen(true)
  }

  // 🔥 Kolom tabel
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 50,
      cell: ({ row }) => <div>{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'total_price',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{formatIndonesianCurrency(row.getValue('total_price'))}</div>
      ),
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
      cell: ({ row }) => <div>{row.original.items.length}</div>,
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
      cell: ({ row }) => (
        <div>{formatIndonesianDateTime(row.getValue('created_at'))}</div>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => handleEdit(order, e)}
            >
              <Pencil className="h-4 w-4 text-blue-500" />
            </Button>
          </div>
        )
      },
    },
  ]

  // 🔥 Handle Pencarian
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase())
  }

  // 🔥 Handle Filter Status
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
  }

  // 🔥 Filter Data Orders
  const filteredOrders = orders.filter(
    (order: Order) =>
      ['id', 'status', 'createdAt'].some((key) =>
        order[key as keyof Order]
          .toString()
          .toLowerCase()
          .includes(searchQuery),
      ) &&
      (statusFilter !== 'all'
        ? String(order.status).toLowerCase() === statusFilter.toLowerCase()
        : true),
  )

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState />

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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        }
        onRowClick={(row) => router.push(`/orders/${row.id}`)}
      />

      <EditOrderFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  )
}
