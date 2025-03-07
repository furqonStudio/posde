import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '../ui/label'

type SelectOption = {
  value: number
  label: string
}

type SelectFieldProps = {
  id: string
  label: string
  options: SelectOption[]
  onChange: (value: number) => void
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  options,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id}>{label}</Label>
      <div className="col-span-3">
        <Select onValueChange={(val) => onChange(Number(val))}>
          <SelectTrigger className="mt-1 w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
