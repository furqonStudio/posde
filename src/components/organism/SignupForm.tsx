'use client'

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

// Validasi formulir menggunakan zod
const signupSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters long'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: 'custom', // Menentukan bahwa ini adalah masalah kustom
        path: ['confirmPassword'], // Menentukan kolom yang akan ditampilkan error
        message: 'Passwords must match', // Pesan error
      })
    }
  })

type SignupFormValues = z.infer<typeof signupSchema>

async function signupUser(
  data: SignupFormValues,
): Promise<{ success: boolean }> {
  const response = await new Promise<{ success: boolean }>((resolve) =>
    setTimeout(() => {
      if (data.email === 'existing@example.com') {
        resolve({ success: false })
      } else {
        resolve({ success: true })
      }
    }, 1000),
  )
  return response
}

export default function SignupForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter()

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const mutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Account created successfully!')
        router.push('/login')
      } else {
        toast.error('Email already exists')
      }
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.')
    },
  })

  const onSubmit = (data: SignupFormValues) => {
    mutation.mutate(data)
  }

  return (
    <Card className="w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
        <CardDescription>Create a new account to get started</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                      disabled={mutation.isPending}
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
                      {...field}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                      disabled={mutation.isPending}
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
              {mutation.isPending ? 'Creating Account...' : 'Create Account'}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitch}
                className="text-primary hover:cursor-pointer hover:underline"
              >
                Login
              </button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
