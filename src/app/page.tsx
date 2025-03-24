'use client'

import LoginForm from '@/components/organism/LoginForm'
import SignupForm from '@/components/organism/SignupForm'

export default function Home() {
  const isLogin = true
  return (
    <main className="flex min-h-screen items-center justify-center">
      {isLogin ? <LoginForm /> : <SignupForm />}
    </main>
  )
}
