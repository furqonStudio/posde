import React, { useState } from 'react'
import { SearchInput } from '../molecules/SearchInput'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { categories as rawCategories, products } from '@/data'
import { ProductCard } from '../molecules/ProductCard'
import { Product } from '@/types'

interface ProductGridProps {
  addToCart: (product: Product) => void
}

export const ProductGrid: React.FC<ProductGridProps> = ({ addToCart }) => {
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = [{ id: 'all', name: 'All' }, ...rawCategories]

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((product) => product.category === activeCategory)

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-lg font-medium">Products</h2>
        <SearchInput />
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="mb-2 flex overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.name}
                onClick={() => setActiveCategory(category.name)}
                className="flex-shrink-0"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
