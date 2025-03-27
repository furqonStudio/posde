'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type User = {
  id: number
  name: string
  email: string
  store_id: string | null
}

type UserContextType = {
  user: User | null
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      document.cookie = `token=${user.id}; path=/;`
    } else {
      localStorage.removeItem('user')
      document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`
    }
  }, [user])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
