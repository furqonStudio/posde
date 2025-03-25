'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

type LoginFormValues = z.infer<typeof loginSchema>

async function loginUser(
  data: LoginFormValues,
): Promise<{ success: boolean; data?: { user: { store_id: string | null } } }> {
  try {
    const response = await axios.post('http://localhost:8000/api/login', data)

    return response.data
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error('Something went wrong. Please try again.')
    }
  }
}

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Login successful!')
        if (data.data?.user.store_id === null) {
          router.push('/create-store')
        } else {
          router.push('/dashboard')
        }
      } else {
        toast.error('Invalid email or password')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data)
  }

  return (
    <Card className="w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your email and password to continue.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Your password"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="mt-4 flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitch}
                className="text-primary hover:cursor-pointer hover:underline"
              >
                Sign up
              </button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
