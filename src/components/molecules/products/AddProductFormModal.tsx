import { fetchCategories } from '@/lib/api'
import type { Product } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { ReusableFormModal } from '../ReusableFormModal'
import { useUser } from '../UserProvider'

interface AddProductFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddProductFormModal: React.FC<AddProductFormModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useUser()
  const queryClient = useQueryClient()

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: { id: 0, name: 'Uncategorized' },
    image: '',
    stock: 0,
  })

  const addProductMutation = useMutation({
    mutationFn: async (newProduct: Partial<Product>) => {
      await axios.post('http://localhost:8000/api/products', newProduct)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      onClose()
      toast.success('Produk berhasil ditambahkan.')
    },
    onError: (error) => {
      console.log(error)
      toast.error('Gagal menambahkan produk.')
    },
  })

  const handleSaveAdd = () => {
    if (!formData.name || formData.price! <= 0 || formData.stock! < 0) {
      toast.error('Harap isi semua bidang dengan benar.')
      return
    }

    const productData = {
      ...formData,
      category_id: formData.category?.id,
      user_id: user?.id,
    }
    delete productData.category
    console.log('🚀 ~ handleSaveAdd ~ productData:', productData)

    addProductMutation.mutate(productData)
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
      id: 'description',
      label: 'Deskripsi',
      type: 'text',
      value: formData.description || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, description: e.target.value }),
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
    id: 'category',
    label: 'Kategori',
    value: formData.category?.id || 0,
    options: categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
    onChange: (value: string | number) => {
      const selectedCategory = categories.find(
        (category) => category.id === Number(value),
      )
      setFormData({
        ...formData,
        category: selectedCategory || { id: 0, name: 'Uncategorized' },
      })
    },
  }

  return (
    <ReusableFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSaveAdd}
      title="Tambah Produk Baru"
      description="Isi detail produk yang ingin ditambahkan."
      fields={formFields}
      imageField={imageField}
      selectField={selectField}
    />
  )
}
