'use client'
import { CategoryManagement } from '@/components/molecules/CategoryManagement'
import React from 'react'

const OrderPages = () => {
  return (
    <div className="w-full overflow-scroll p-4">
      <CategoryManagement
        categories={[{ id: 1, name: 'asd' }]}
        onCategoryChange={() => {}}
      />
    </div>
  )
}

export default OrderPages
