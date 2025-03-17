import { fetchCategories } from '@/lib/api'
import type { Product } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ReusableFormModal } from '../ReusableFormModal'

interface EditProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export const EditProductFormModal: React.FC<EditProductFormModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category_id: 0,
    image: '',
    stock: 0,
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        category_id: product.category?.id,
        image: product.image,
        stock: product.stock,
      })
    }
  }, [product])

  const queryClient = useQueryClient()

  const editProductMutation = useMutation({
    mutationFn: async (updatedProduct: Partial<Product>) => {
      await axios.put(
        `http://localhost:8000/api/products/${product?.id}`,
        updatedProduct,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['product', String(product?.id)],
      })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      onClose()
      toast.success('Produk berhasil diperbarui.')
    },
  })

  const handleSaveEdit = () => {
    if (!formData.name || formData.price! <= 0 || formData.stock! < 0) {
      toast.error('Harap isi semua bidang dengan benar.')
      return
    }
    editProductMutation.mutate(formData)
  }

  const formFields = [
    {
      id: 'name',
      label: 'Nama',
      type: 'text',
      value: formData.name || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, name: e.target.value }),
    },
    {
      id: 'price',
      label: 'Harga',
      type: 'number',
      value: formData.price || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, price: Number(e.target.value) || 0 }),
    },
    {
      id: 'stock',
      label: 'Stok',
      type: 'number',
      value: formData.stock || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, stock: Number(e.target.value) || 0 }),
    },
  ]

  const imageField = {
    id: 'image',
    label: 'Gambar',
    value: formData.image || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    onRemove: () => {
      setFormData((prev) => ({
        ...prev,
        image: '',
      }))
    },
  }

  const selectField = {
    id: 'category_id',
    label: 'Kategori',
    value: formData.category_id ?? 0,
    defaultValue: formData.category_id ? String(formData.category_id) : '',
    options: categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
    onChange: (value: string | number) => {
      setFormData({ ...formData, category_id: Number(value) })
    },
  }

  return (
    <ReusableFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSaveEdit}
      title="Edit Product"
      description="Make changes to the product details here."
      fields={formFields}
      imageField={imageField}
      selectField={selectField}
    />
  )
}
