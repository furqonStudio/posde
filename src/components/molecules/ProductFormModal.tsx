'use client'

import React from 'react'
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
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import type { Product } from '@/types'

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: Partial<Product>) => void
  product?: Product
  title: string
  description: string
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  product,
  title,
  description,
}: ProductFormModalProps) {
  const [formData, setFormData] = React.useState<Partial<Product>>({
    name: product?.name || '',
    price: product?.price || 0,
    category: product?.category || '',
    image: product?.image || '',
  })

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
      })
    } else {
      setFormData({
        name: '',
        price: 0,
        category: '',
        image: '',
      })
    }
  }, [product])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: '',
    }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Image
            </Label>
            <div className="col-span-3">
              {formData.image && (
                <div className="mb-2">
                  <Image
                    src={formData.image || '/placeholder.svg'}
                    alt="Product"
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="mt-2"
                  >
                    Remove Image
                  </Button>
                </div>
              )}
              <Input
                id="image"
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              value={formData.category}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
