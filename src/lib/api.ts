import { SimpleCategory } from '@/types'
import axios from 'axios'

export const fetchCategories = async (): Promise<SimpleCategory[]> => {
  try {
    const { data } = await axios.get('http://localhost:8000/api/categories')
    return data?.data ?? []
  } catch (err) {
    console.error('Error fetching categories:', err)
    throw new Error('Gagal mengambil data kategori.')
  }
}
