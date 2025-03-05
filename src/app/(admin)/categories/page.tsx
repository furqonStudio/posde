'use client'
import { CategoryManagement } from '@/components/molecules/CategoryManagement'
import React from 'react'

const CategoriesPage = () => {
  return (
    <div className="w-full overflow-scroll p-4">
      <CategoryManagement />
    </div>
  )
}

export default CategoriesPage
