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
import { SelectField } from './SelectFIeld'

interface FormField {
  id: string
  label: string
  type: string
  value: any
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface ReusableFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  title: string
  description: string
  fields: FormField[]
  imageField?: {
    id: string
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onRemove: () => void
  }
  selectField?: {
    id: string
    label: string
    value: number
    options: { value: number; label: string }[]
    onChange: (value: number) => void
  }
}

export function ReusableFormModal({
  isOpen,
  onClose,
  onSave,
  title,
  description,
  fields,
  imageField,
  selectField,
}: ReusableFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {imageField && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={imageField.id}>{imageField.label}</Label>
              <div className="col-span-3">
                {imageField.value && (
                  <div className="mb-2">
                    <Image
                      src={imageField.value || '/placeholder.svg'}
                      alt="Image"
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={imageField.onRemove}
                      className="mt-2"
                    >
                      Remove Image
                    </Button>
                  </div>
                )}
                <Input
                  id={imageField.id}
                  type="file"
                  onChange={imageField.onChange}
                  accept="image/*"
                />
              </div>
            </div>
          )}
          {fields.map((field) => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.type}
                value={field.value}
                onChange={field.onChange}
                className="col-span-3"
              />
            </div>
          ))}
          {selectField && (
            <SelectField
              id={selectField.id}
              label={selectField.label}
              options={selectField.options}
              onChange={selectField.onChange}
            />
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
