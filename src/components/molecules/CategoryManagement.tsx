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

interface CategoryManagementProps {
  categories: Category[]
  onCategoryChange: (categories: Category[]) => void
}

export function CategoryManagement({
  categories,
  onCategoryChange,
}: CategoryManagementProps) {
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
    const updatedCategories = categories.filter((cat) => cat.id !== categoryId)
    onCategoryChange(updatedCategories)
    toast.success('Category deleted successfully')
  }

  const handleSaveCategory = () => {
    if (categoryName.trim() === '') {
      toast.error('Category name cannot be empty')
      return
    }

    let updatedCategories: Category[]
    if (editingCategory) {
      updatedCategories = categories.map((cat) =>
        cat.id === editingCategory.id ? { ...cat, name: categoryName } : cat,
      )
      toast.success('Category updated successfully')
    } else {
      const newCategory: Category = {
        id: Math.max(0, ...categories.map((c) => c.id)) + 1,
        name: categoryName,
      }
      updatedCategories = [...categories, newCategory]
      toast.success('Category added successfully')
    }

    onCategoryChange(updatedCategories)
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
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
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
