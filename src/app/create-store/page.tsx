'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'

// Zod Schema for Validation
const createStoreSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  businessType: z.string().min(1, 'Business type is required'),
})

type CreateStoreFormValues = z.infer<typeof createStoreSchema>

const fetchBusinessTypes = async () => {
  const { data } = await axios.get('http://localhost:8000/api/business-types')
  return data
}

export default function CreateStorePage() {
  const queryClient = useQueryClient()
  const user = queryClient.getQueryData<{ id: string }>(['user'])
  console.log('🚀 ~ mutationFn: ~ user:', user)

  const {
    data: businessTypes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['businessTypes'],
    queryFn: fetchBusinessTypes,
  })

  const router = useRouter()

  const form = useForm<CreateStoreFormValues>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: '',
      address: '',
      businessType: '',
    },
  })

  // React Query Mutation
  const mutation = useMutation({
    mutationFn: async (data: CreateStoreFormValues) => {
      const transformedData = {
        name: data.name,
        address: data.address,
        business_type: data.businessType,
      }

      const response = await axios.post(
        'http://localhost:8000/api/stores',
        transformedData,
      )

      const storeData = response.data

      queryClient.setQueryData(['user'], (oldUser: any) => {
        if (oldUser) {
          return {
            ...oldUser,
            store_id: storeData.id,
          }
        }
        return oldUser
      })

      const user = queryClient.getQueryData<{ id: string }>(['user'])

      const userId = user?.id
      await axios.put(`http://localhost:8000/api/users/${userId}`, {
        store_id: parseInt(storeData.id),
      })

      return storeData
    },
    onSuccess: () => {
      toast.success('Store created successfully!')
      router.push('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create store!')
    },
  })

  const onSubmit = (data: CreateStoreFormValues) => {
    mutation.mutate(data)
  }

  if (isLoading) {
    return <p>Loading business types...</p>
  }

  if (isError) {
    return <p>Failed to load business types. Please try again later.</p>
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create Store Form
          </CardTitle>
          <CardDescription>
            Please fill out the form to create a store.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes?.map((type: string) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                className="w-full"
                variant="ghost"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
