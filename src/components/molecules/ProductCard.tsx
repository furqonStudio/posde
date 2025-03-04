import { Card, CardContent } from '@/components/ui/card'
import { Product } from '@/types'
import { formatCurrency } from '@/utils/format'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
  addToCart: (product: Product) => void
}

export function ProductCard({ product, addToCart }: ProductCardProps) {
  return (
    <Card
      className="hover:border-primary cursor-pointer overflow-hidden p-0 transition-colors"
      onClick={() => addToCart(product)}
    >
      <CardContent className="p-2">
        <div className="flex flex-col items-center gap-2">
          <Image
            src={'/botol.jpg'}
            alt={product.name}
            width={300}
            height={300}
            className="rounded-md object-cover"
          />
          <div>
            <h3 className="text-center text-sm font-medium">{product.name}</h3>
            <p className="text-primary font-bold">
              {formatCurrency(product.price)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
