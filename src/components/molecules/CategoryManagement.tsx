'use client'

import { useState } from 'react'
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
import { Pencil, Plus, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Category {
  id: number
  name: string
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState('')

  const handleAddCategory = () => {
    setEditingCategory(null)
    setCategoryName('')
    setIsModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setCategoryName(category.name)
    setIsModalOpen(true)
  }

  const handleDeleteCategory = (categoryId: number) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))
    toast.success('Category deleted successfully')
  }

  const handleSaveCategory = () => {
    if (categoryName.trim() === '') {
      toast.error('Category name cannot be empty')
      return
    }

    setCategories((prev) => {
      if (editingCategory) {
        return prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, name: categoryName } : cat,
        )
      } else {
        return [
          ...prev,
          {
            id: Math.max(0, ...prev.map((c) => c.id)) + 1,
            name: categoryName,
          },
        ]
      }
    })

    toast.success(
      editingCategory
        ? 'Category updated successfully'
        : 'Category added successfully',
    )
    setIsModalOpen(false)
    setCategoryName('')
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Category Management</h2>
        <Button onClick={handleAddCategory}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-2/4 border-r">Name</TableHead>
            <TableHead className="w-1/4 border-r">Total Products</TableHead>
            <TableHead className="w-1/4 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="w-2/4 border-r">{category.name}</TableCell>
              <TableCell className="w-1/4 border-r">10</TableCell>
              <TableCell className="w-1/4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Edit the category name below.'
                : 'Enter the name for the new category.'}
            </DialogDescription>
          </DialogHeader>
          <Input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category Name"
          />
          <DialogFooter>
            <Button onClick={handleSaveCategory}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
