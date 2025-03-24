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

export default function SelectStore() {
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
                  <form
                    key={store.id}
                    onSubmit={(e) => {
                      e.preventDefault()
                      alert(`Selected Store: ${store.name}`)
                    }}
                  >
                    <input type="hidden" name="storeId" value={store.id} />
                    <Button
                      type="submit"
                      variant="outline"
                      className="h-auto w-full justify-start px-4 py-3"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{store.name}</span>
                        <span className="text-muted-foreground text-sm">
                          {store.description}
                        </span>
                      </div>
                    </Button>
                  </form>
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
    </div>
  )
}
