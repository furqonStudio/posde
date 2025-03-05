'use client'

import * as React from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Pencil, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Image from 'next/image'
import { formatCurrency } from '@/utils/format'
import type { Product } from '@/types'
import { products as initialProducts } from '@/data'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProductFormModal } from './ProductFormModal'

export function ProductsTable() {
  const [products, setProducts] = React.useState<Product[]>(initialProducts)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null,
  )

  // Define columns inside the component to access the handlers
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => (
        <Image
          src={row.getValue('image') || '/placeholder.svg'}
          alt={row.getValue('name')}
          width={32}
          height={32}
          className="rounded-sm"
        />
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'price',
      header: () => <div className="text-right">Price</div>,
      cell: ({ row }) => {
        const price = Number.parseFloat(row.getValue('price'))
        const formatted = formatCurrency(price)
        return <div className="text-right font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <div>{row.getValue('category')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      header: 'Actions',
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(product)}
            >
              <Pencil className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(product.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: products,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleAdd = () => {
    setIsAddModalOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleSaveAdd = (newProduct: Partial<Product>) => {
    const productToAdd = {
      ...newProduct,
      id: products.length + 1, // This is a simple way to generate an ID. In a real app, you'd use a more robust method.
      price: Number(newProduct.price),
    } as Product

    setProducts([...products, productToAdd])
    setIsAddModalOpen(false)
    toast.success('Product added', {
      description: `${newProduct.name} has been added successfully.`,
    })
  }

  const handleSaveEdit = (updatedProduct: Partial<Product>) => {
    if (!selectedProduct) return

    const updatedProducts = products.map((product) => {
      if (product.id === selectedProduct.id) {
        return {
          ...product,
          ...updatedProduct,
          price: Number(updatedProduct.price),
        }
      }
      return product
    })

    setProducts(updatedProducts)
    setIsEditModalOpen(false)
    toast.success('Product updated', {
      description: `${updatedProduct.name} has been updated successfully.`,
    })
  }

  const handleDelete = (productId: number) => {
    const product = products.find((product) => product.id === productId)
    if (product) {
      setSelectedProduct(product)
      setIsDeleteModalOpen(true)
    }
  }

  const confirmDelete = () => {
    if (!selectedProduct) return

    const updatedProducts = products.filter(
      (product) => product.id !== selectedProduct.id,
    )
    setProducts(updatedProducts)
    setIsDeleteModalOpen(false)
    toast.error('Product deleted', {
      description: `${selectedProduct.name} has been deleted successfully.`,
    })
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 pb-4">
        <h2 className="ml-8 text-lg font-medium md:ml-0">Products Table</h2>
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Input
              placeholder="Search products..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <Select
              value={
                (table.getColumn('category')?.getFilterValue() as string) ?? ''
              }
              onValueChange={(value) =>
                table.getColumn('category')?.setFilterValue(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.from(new Set(products.map((p) => p.category))).map(
                  (category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-bold text-black">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground text-sm">
          {table.getFilteredRowModel().rows.length} products total
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Add Modal */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAdd}
        title="Add New Product"
        description="Enter the details for the new product."
      />

      {/* Edit Modal */}
      <ProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        product={selectedProduct || undefined}
        title="Edit Product"
        description="Make changes to the product details here."
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product
              {selectedProduct && ` "${selectedProduct.name}"`} from the
              database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
