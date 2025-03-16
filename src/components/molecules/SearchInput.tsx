import { Search } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (query: string) => void
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <div className="relative w-64">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search..."
        className="focus:border-primary focus:ring-primary w-full rounded-md border px-10 py-2 text-sm focus:ring-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
