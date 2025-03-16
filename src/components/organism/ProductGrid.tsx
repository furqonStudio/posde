import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { SearchInput } from '../molecules/SearchInput'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { ProductCard } from '../molecules/ProductCard'
import { Product, SimpleCategory } from '@/types'

interface ProductGridProps {
  addToCart: (product: Product) => void
}

export const ProductGrid: React.FC<ProductGridProps> = ({ addToCart }) => {
  const [activeCategory, setActiveCategory] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const {
    data: productsData = [],
    isLoading: isProductsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get(
        'http://localhost:8000/api/products?per_page=all',
      )
      return data?.data ?? []
    },
  })

  const {
    data: categoriesData = [],
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:8000/api/categories')
      return data?.data ?? []
    },
  })

  const categories: SimpleCategory[] = [
    { id: 0, name: 'All' },
    ...categoriesData,
  ]

  const filteredProducts = productsData
    .filter((product: Product) =>
      activeCategory === 0 ? true : product.category.id === activeCategory,
    )
    .filter((product: Product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-lg font-medium">Products</h2>
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isCategoriesLoading ? (
          <p>Loading categories...</p>
        ) : categoriesError ? (
          <p>Error loading categories</p>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-2 flex overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={String(category.id)}
                  onClick={() => setActiveCategory(category.id)}
                  className="flex-shrink-0"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={String(activeCategory)} className="mt-0">
              {isProductsLoading ? (
                <p>Loading products...</p>
              ) : productsError ? (
                <p>Error loading products</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {filteredProducts.map((product: Product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      addToCart={addToCart}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
