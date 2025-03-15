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
  value: number | string
  label: string
}

type SelectFieldProps = {
  id: string
  label: string
  options: SelectOption[]
  onChange: (value: number | string) => void
  defaultValue?: string | number
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  options,
  onChange,
  defaultValue,
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id}>{label}</Label>
      <div className="col-span-3">
        <Select
          defaultValue={defaultValue?.toString()}
          onValueChange={(val) => {
            const parsedValue = isNaN(Number(val)) ? val : Number(val)
            onChange(parsedValue)
          }}
        >
          <SelectTrigger className="mt-1 w-full">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{label}</SelectLabel>
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
