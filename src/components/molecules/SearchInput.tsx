import { Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '../ui/input'

export const SearchInput = () => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
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
  )
}
