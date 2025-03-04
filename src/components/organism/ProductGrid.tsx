import { ProductCard } from "@/components/molecules/ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  formatCurrency: (amount: number) => string;
}

export function ProductGrid({
  products,
  onAddToCart,
  formatCurrency,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          formatCurrency={formatCurrency}
        />
      ))}
    </div>
  );
}
