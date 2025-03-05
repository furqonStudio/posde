import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Category } from '@/types'

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (category: Partial<Category>) => void
  category?: Category
  title: string
  description: string
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  title,
  description,
}) => {
  const [name, setName] = useState('')

  useEffect(() => {
    if (category) {
      setName(category.name)
    } else {
      setName('')
    }
  }, [category])

  const handleSave = () => {
    onSave({ name })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
        />
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
