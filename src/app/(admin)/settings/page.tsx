'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SettingsPage() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'My Store',
    address: '123 Main Street, City, Country',
    phone: '+1 234 567 890',
    email: 'store@example.com',
  })

  const [userSettings, setUserSettings] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
  })

  type StoreSettings = {
    storeName: string
    address: string
    phone: string
    email: string
  }

  type UserSettings = {
    name: string
    email: string
    role: string
  }

  const handleStoreChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setStoreSettings((prev: StoreSettings) => ({ ...prev, [name]: value }))
  }

  const handleUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setUserSettings((prev: UserSettings) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="w-full overflow-scroll p-4">
      <h2 className="text-lg font-medium">Settings</h2>

      <Tabs defaultValue="store" className="mt-4">
        <TabsList>
          <TabsTrigger value="store">Store Settings</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Update your store details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    name="storeName"
                    value={storeSettings.storeName}
                    onChange={handleStoreChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={storeSettings.email}
                    onChange={handleStoreChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={storeSettings.address}
                  onChange={handleStoreChange}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={storeSettings.phone}
                    onChange={handleStoreChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="self-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={userSettings.name}
                    onChange={handleUserChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Email</Label>
                  <Input
                    id="userEmail"
                    name="email"
                    type="email"
                    value={userSettings.email}
                    onChange={handleUserChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  value={userSettings.role}
                  disabled
                />
                <p className="text-muted-foreground text-sm">
                  Your role determines your permissions in the system
                </p>
              </div>
            </CardContent>
            <CardFooter className="self-end">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
