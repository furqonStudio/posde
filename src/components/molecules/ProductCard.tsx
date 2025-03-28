import { Card, CardContent } from '@/components/ui/card'
import { Product } from '@/types'
import { formatIndonesianCurrency } from '@/utils/format'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
  addToCart: (product: Product) => void
}

export function ProductCard({ product, addToCart }: ProductCardProps) {
  const isOutOfStock = product.stock === 0

  return (
    <Card
      className={`hover:border-primary overflow-hidden p-0 transition-colors ${
        isOutOfStock ? 'pointer-events-none grayscale' : 'cursor-pointer'
      }`}
      onClick={() => !isOutOfStock && addToCart(product)}
    >
      <CardContent className="relative p-2">
        <div className="flex flex-col items-center gap-2">
          <Image
            src={'/botol.jpg'}
            alt={product.name}
            width={300}
            height={300}
            className="rounded-md object-cover"
          />
          <div className="w-full">
            <h3 className="truncate text-center text-sm font-medium">
              {product.name}
            </h3>
            <p className="text-primary text-center font-bold">
              {formatIndonesianCurrency(product.price)}
            </p>
          </div>
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <p className="z-10 text-sm font-bold text-white">Stok Habis</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
