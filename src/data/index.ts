import { Product } from '@/types'
import type { Order } from '@/types'
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  SquareMenu,
  Package,
  Boxes,
} from 'lucide-react'

export const categories = [
  {
    id: 1,
    name: 'Makanan',
    products: 20,
  },
  {
    id: 2,
    name: 'Minuman',
    products: 20,
  },
]

export const products: Product[] = [
  {
    id: 1,
    name: 'Chicken Rice',
    price: 25000,
    category: 'Makanan',
    image: '/botol.jpg',
  },
  {
    id: 2,
    name: 'Beef Burger',
    price: 30000,
    category: 'Makanan',
    image: '/botol.jpg',
  },
  {
    id: 3,
    name: 'Veggie Salad',
    price: 20000,
    category: 'Makanan',
    image: '/botol.jpg',
  },
  {
    id: 4,
    name: 'Fish Tacos',
    price: 35000,
    category: 'Makanan',
    image: '/botol.jpg',
  },
  {
    id: 5,
    name: 'Pasta Carbonara',
    price: 40000,
    category: 'Makanan',
    image: '/botol.jpg',
  },
  {
    id: 6,
    name: 'Grilled Cheese',
    price: 15000,
    category: 'Makanan',
    image: '/botol.jpg',
  },
  {
    id: 7,
    name: 'Caesar Salad',
    price: 22000,
    category: 'Makanan',
    image: '/botol.jpg',
  },
  {
    id: 8,
    name: 'Tomato Soup',
    price: 18000,
    category: 'Makanan',
    image: '/botol.jpg',
  },
  {
    id: 9,
    name: 'Chicken Wings',
    price: 28000,
    category: 'Makanan',
    image: '/botol.jpg',
  },
  {
    id: 10,
    name: 'Steak',
    price: 50000,
    category: 'Makanan',
    image: '/botol.jpg',
  },
  {
    id: 11,
    name: 'Pizza Margherita',
    price: 45000,
    category: 'Makanan',
    image: '/botol.jpg',
  },
  {
    id: 12,
    name: 'Sushi',
    price: 60000,
    category: 'Makanan',
    image: '/botol.jpg',
  },
  {
    id: 13,
    name: 'Pancakes',
    price: 20000,
    category: 'Makanan',
    image: '/botol.jpg',
  },
  {
    id: 14,
    name: 'French Fries',
    price: 12000,
    category: 'Makanan',
    image: '/botol.jpg',
  },
  {
    id: 15,
    name: 'Ice Cream',
    price: 15000,
    category: 'Makanan',
    image: '/botol.jpg',
  },
  {
    id: 16,
    name: 'Chocolate Cake',
    price: 30000,
    category: 'Minuman',
    image: '/botol.jpg',
  },
  {
    id: 17,
    name: 'Apple Pie',
    price: 25000,
    category: 'Minuman',
    image: '/botol.jpg',
  },
  {
    id: 18,
    name: 'Cheesecake',
    price: 35000,
    category: 'Minuman',
    image: '/botol.jpg',
  },
  {
    id: 19,
    name: 'Muffin',
    price: 10000,
    category: 'Minuman',
    image: '/botol.jpg',
  },
  {
    id: 20,
    name: 'Donut',
    price: 8000,
    category: 'Minuman',
    image: '/botol.jpg',
  },
]

export const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: SquareMenu, label: 'Menu', href: '/menu' },
  { icon: ShoppingBag, label: 'Orders', href: '/orders' },
  { icon: Package, label: 'Products', href: '/products' },
  { icon: Boxes, label: 'Categories', href: '/categories' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export const orders: Order[] = [
  {
    id: 1,
    totalPrice: 100.0,
    status: 'Pending',
    items: 2,
    createdAt: '2025-03-01T12:00:00Z',
  },
  {
    id: 2,
    totalPrice: 200.0,
    status: 'Completed',
    items: 3,
    createdAt: '2025-03-02T12:00:00Z',
  },
  {
    id: 3,
    totalPrice: 150.0,
    status: 'Shipped',
    items: 1,
    createdAt: '2025-03-03T12:00:00Z',
  },
]
