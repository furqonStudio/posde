export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

export type Product = {
  id: number
  name: string
  price: number
  category: string
  image: string
}

export type Category = {
  id: number
  name: string
}

export type Order = {
  id: number
  totalPrice: number
  status: string
  items: number
  createdAt: string
}
