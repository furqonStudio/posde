'use client'

import LoginForm from '@/components/organism/LoginForm'
import SignupForm from '@/components/organism/SignupForm'
import { useState } from 'react'

export default function Home() {
  const [isLogin, setIsLogin] = useState(false)

  return (
    <main className="flex min-h-screen items-center justify-center">
      {isLogin ? (
        <LoginForm onSwitch={() => setIsLogin(false)} />
      ) : (
        <SignupForm onSwitch={() => setIsLogin(true)} />
      )}
    </main>
  )
}
