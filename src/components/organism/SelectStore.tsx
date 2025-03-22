import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
// import { selectStore } from "./actions"

// Mock data - in a real app, this would come from your database
const mockStores = [
  // Empty array to simulate a user with no stores
  // In a real app, you would fetch the user's stores from your database
]

export default function SelectStorePage() {
  // Check if the user is authenticated
  const cookieStore = cookies()
  const authToken = cookieStore.get('auth-token')

  if (!authToken) {
    redirect('/login')
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
                {mockStores.map((store, index) => (
                  <form key={index} action={selectStore}>
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
            <div className="space-y-4 py-6 text-center">
              <p className="text-muted-foreground">
                You don&apos;t have any stores yet.
              </p>
              <Button asChild>
                <Link href="/create-store">Create a Store</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
