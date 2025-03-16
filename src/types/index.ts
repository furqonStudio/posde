type Item = {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

export type CartItem = Item
export type OrderItem = Item

export type SimpleCategory = {
  id: number
  name: string
}

export type Product = {
  id: number
  name: string
  price: number
  category_id?: number
  category: SimpleCategory
  image?: string
  stock: number
  description: string | null
  created_at: string
  updated_at: string
}

export type Category = {
  id: number
  name: string
  products: Product[]
  created_at: string
  updated_at: string
}

export type OrderItems = {
  product: Product[]
  quantity: number
  price: number
  subtotal: number
}

export type Order = {
  id: number
  totalPrice: number
  status: string
  items: OrderItems[]
  createdAt: string
}

// type orderData = {
//   id: string
//   date: string
//   customer: {
//     name: string
//     email: string
//     phone: string
//   }
//   status: string
//   paymentMethod: string
//   paymentStatus: string
//   items: {
//     id: number
//     name: string
//     price: number
//     quantity: number
//   }[]
//   subtotal: number
//   tax: number
//   discount: number
//   total: number
// }
