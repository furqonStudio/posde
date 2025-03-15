'use client'
import { CategoriesTable } from '@/components/molecules/categories/CategoriesTable'
import { OrdersTable } from '@/components/molecules/orders/OrdersTable'
import React from 'react'

const OrderPages = () => {
  return (
    <div className="w-full overflow-scroll p-4">
      <OrdersTable />
    </div>
  )
}

export default OrderPages
