'use client'
import { OrdersTable } from '@/components/molecules/orders/OrdersTable'

const OrderPages = () => {
  return (
    <div className="w-full overflow-scroll p-4">
      <OrdersTable />
    </div>
  )
}

export default OrderPages
