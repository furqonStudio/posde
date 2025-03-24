'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState } from 'react'
import { ConfirmationAlert } from '../molecules/ConfirmationAlert'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

const mockStores = [
  {
    id: '1',
    name: 'Store Alpha',
    description: 'Your primary store for electronics.',
  },
  {
    id: '2',
    name: 'Store Beta',
    description: 'Clothing and fashion store.',
  },
]

const useStoreSelection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (store) => Promise.resolve(store),
    onSuccess: (data) => {
      queryClient.setQueryData(['selectedStore'], data)
    },
  })
}

export default function SelectStore() {
  const [selectedStore, setSelectedStore] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { mutate: selectStore } = useStoreSelection()
  const router = useRouter()
  const handleSelectStore = (store: any) => {
    setSelectedStore(store)
    setIsDialogOpen(true)
  }

  const handleConfirmStore = () => {
    if (selectedStore) {
      selectStore(selectedStore)
    }
    router.push('/dashboard')
    setIsDialogOpen(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Select Store</CardTitle>
          <CardDescription>
            Choose a store to continue or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockStores.length > 0 ? (
            <div className="space-y-4">
              <div className="grid gap-2">
                {mockStores.map((store) => (
                  <Button
                    key={store.id}
                    variant="outline"
                    className="h-auto w-full justify-start px-4 py-3"
                    onClick={() => handleSelectStore(store)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{store.name}</span>
                      <span className="text-muted-foreground text-sm">
                        {store.description}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              You don&apos;t have any stores yet.
            </p>
          )}
          <div className="text-center">
            <Button asChild>
              <Link href="/create-store">Create a Store</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmationAlert
        title="Confirm Store Selection"
        description=" Are you sure you want to select this store?"
        onClick={handleConfirmStore}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        actionText="Confirm"
      />
    </div>
  )
}
