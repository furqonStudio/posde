import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  SquareMenu,
  Package,
} from 'lucide-react'

export const categories = ['All', 'Food', 'Beverages', 'Snacks', 'Desserts']

export const products = [
  {
    id: 1,
    name: 'Chicken Rice',
    price: 25000,
    category: 'Food',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 2,
    name: 'Beef Noodle',
    price: 30000,
    category: 'Food',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 3,
    name: 'Iced Tea',
    price: 8000,
    category: 'Beverages',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 4,
    name: 'Coffee',
    price: 12000,
    category: 'Beverages',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 5,
    name: 'French Fries',
    price: 15000,
    category: 'Snacks',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 6,
    name: 'Potato Chips',
    price: 10000,
    category: 'Snacks',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 7,
    name: 'Ice Cream',
    price: 18000,
    category: 'Desserts',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 8,
    name: 'Chocolate Cake',
    price: 22000,
    category: 'Desserts',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 9,
    name: 'Vegetable Soup',
    price: 20000,
    category: 'Food',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 10,
    name: 'Orange Juice',
    price: 10000,
    category: 'Beverages',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 11,
    name: 'Chicken Sandwich',
    price: 23000,
    category: 'Food',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 12,
    name: 'Mineral Water',
    price: 5000,
    category: 'Beverages',
    image: '/placeholder.svg?height=80&width=80',
  },
]

export const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: SquareMenu, label: 'Menu', href: '/menu' },
  { icon: ShoppingBag, label: 'Orders', href: '/orders' },
  { icon: Package, label: 'Products', href: '/products' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]
