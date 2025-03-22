import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createStore } from './actions'

export default function CreateStorePage() {
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
          <CardTitle className="text-2xl font-bold">Create a Store</CardTitle>
          <CardDescription>
            Set up your store to start selling products
          </CardDescription>
        </CardHeader>
        <form action={createStore}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="My Awesome Store"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell us about your store"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Store Category</Label>
              <Select name="category">
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                  <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                  <SelectItem value="food">Food & Beverage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Create Store
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/select-store">Cancel</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
