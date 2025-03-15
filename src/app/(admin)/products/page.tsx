import { ProductsTable } from '@/components/molecules/products/ProductsTable'
import React from 'react'

const page = () => {
  return (
    <div className="w-full overflow-scroll p-4">
      <ProductsTable />
    </div>
  )
}

export default page
