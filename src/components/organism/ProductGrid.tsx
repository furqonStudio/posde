import React, { useState } from 'react'
import { SearchInput } from '../molecules/SearchInput'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { categories, products } from '@/data'
import { ProductCard } from '../molecules/ProductCard'
import { Product } from '@/types'

interface ProductGridProps {
  addToCart: (product: Product) => void
}

export const ProductGrid: React.FC<ProductGridProps> = ({ addToCart }) => {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((product) => product.category === activeCategory)

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <SearchInput />

      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="mb-4 flex overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => setActiveCategory(category)}
                className="flex-shrink-0"
              >
                {category}
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
