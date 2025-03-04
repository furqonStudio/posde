"use client";

import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Receipt,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { ProductCard } from "./molecules/ProductCard";

// Product categories and sample products
const categories = ["All", "Food", "Beverages", "Snacks", "Desserts"];

const products = [
  {
    id: 1,
    name: "Chicken Rice",
    price: 25000,
    category: "Food",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Beef Noodle",
    price: 30000,
    category: "Food",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Iced Tea",
    price: 8000,
    category: "Beverages",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Coffee",
    price: 12000,
    category: "Beverages",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    name: "French Fries",
    price: 15000,
    category: "Snacks",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 6,
    name: "Potato Chips",
    price: 10000,
    category: "Snacks",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 7,
    name: "Ice Cream",
    price: 18000,
    category: "Desserts",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 8,
    name: "Chocolate Cake",
    price: 22000,
    category: "Desserts",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 9,
    name: "Vegetable Soup",
    price: 20000,
    category: "Food",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 10,
    name: "Orange Juice",
    price: 10000,
    category: "Beverages",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 11,
    name: "Chicken Sandwich",
    price: 23000,
    category: "Food",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 12,
    name: "Mineral Water",
    price: 5000,
    category: "Beverages",
    image: "/placeholder.svg?height=80&width=80",
  },
];

// Navigation menu items
const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: Package, label: "Products", active: true },
  { icon: ShoppingBag, label: "Orders", active: false },
  { icon: Users, label: "Customers", active: false },
  { icon: BarChart3, label: "Reports", active: false },
  { icon: Settings, label: "Settings", active: false },
];

// Cart item type
type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export default function PosInterface() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [cashAmount, setCashAmount] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);

  // Filter products based on category and search query
  const filteredProducts = products.filter(
    (product) =>
      (activeCategory === "All" || product.category === activeCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Add product to cart
  const addToCart = (product: (typeof products)[0]) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (id: number, change: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + change) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  // Remove item from cart
  const removeItem = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Calculate subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const total = subtotal + tax;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate change
  const calculateChange = () => {
    const cashValue = Number.parseInt(cashAmount.replace(/\D/g, "")) || 0;
    return Math.max(0, cashValue - total);
  };

  // Sidebar component
  const Sidebar = ({
    collapsed,
    onCollapse,
  }: {
    collapsed: boolean;
    onCollapse: () => void;
  }) => (
    <div
      className={`bg-muted/30 flex h-full flex-col border-r transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between border-b p-4">
        {!collapsed && <h1 className="text-xl font-bold">POS System</h1>}
        <Button variant="ghost" size="icon" onClick={onCollapse}>
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className={`mb-1 w-full justify-start ${collapsed ? "px-2" : ""}`}
            >
              <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-2"}`} />
              {!collapsed && item.label}
            </Button>
          ))}
        </div>
      </ScrollArea>
      {!collapsed && (
        <div className="mt-auto border-t p-3">
          <Button
            variant="ghost"
            className="text-destructive w-full justify-start"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Left sidebar - Navigation (hidden on mobile) */}
      <div
        className={`hidden transition-all duration-300 md:block ${
          leftSidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <Sidebar
          collapsed={leftSidebarCollapsed}
          onCollapse={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
        />
      </div>

      {/* Mobile menu button and sheet */}
      <div className="md:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 left-3 z-10"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar
              collapsed={false}
              onCollapse={() => setMobileMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Middle - Products */}
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="ml-8 text-lg font-medium md:ml-0">Products</h2>
          <div className="relative w-64">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

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
                    onAddToCart={onAddToCart}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Cart */}
      <div
        className={`bg-muted/30 flex h-full flex-col border-l transition-all duration-300 ${
          rightSidebarCollapsed ? "w-16" : "w-full md:w-1/3 lg:w-1/4"
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          {!rightSidebarCollapsed && (
            <>
              <ShoppingCart className="h-5 w-5" />
              <h2 className="text-lg font-medium">Current Order</h2>
              <Badge variant="outline">{cart.length} items</Badge>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
            className={rightSidebarCollapsed ? "ml-auto" : ""}
          >
            {rightSidebarCollapsed ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {!rightSidebarCollapsed && (
          <>
            <ScrollArea className="flex-1">
              {cart.length === 0 ? (
                <div className="text-muted-foreground flex h-40 flex-col items-center justify-center">
                  <ShoppingCart className="mb-2 h-10 w-10" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3 p-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-background flex items-center gap-3 rounded-lg p-2"
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-12 w-12 rounded"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-medium">
                          {item.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive h-7 w-7"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="border-t p-4">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={cart.length === 0}
                    onClick={() => setCart([])}
                  >
                    Clear All
                  </Button>
                  <Button
                    className="w-full"
                    disabled={cart.length === 0}
                    onClick={() => setPaymentDialogOpen(true)}
                  >
                    Pay Now
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Payment Dialog */}
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Banknote className="mr-2 h-4 w-4" />
                    Cash
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="cash-amount" className="text-sm font-medium">
                  Cash Amount
                </label>
                <Input
                  id="cash-amount"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  placeholder="Enter cash amount"
                />
              </div>

              {cashAmount && (
                <div className="flex justify-between font-medium">
                  <span>Change</span>
                  <span>{formatCurrency(calculateChange())}</span>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setPaymentDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setPaymentDialogOpen(false);
                  setCart([]);
                  setCashAmount("");
                }}
                className="gap-2"
              >
                <Receipt className="h-4 w-4" />
                Complete Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
