type Item = {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

export type CartItem = Item
export type OrderItem = Item

export type Product = {
  id: number
  name: string
  price: number
  category: string
  image: string
  // stock: number
  // description: string | null
  // created_at: string
  // updated_at: string
}

export type Category = {
  id: number
  name: string
  products: Product[]
}

export type Order = {
  id: number
  totalPrice: number
  status: string
  items: number
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
