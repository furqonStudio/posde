'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'
import { menuItems } from '@/data'
import { usePathname, useRouter } from 'next/navigation'

export const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div
      className={`hidden transition-all duration-300 md:block ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div
        className={`bg-muted/30 flex h-full flex-col border-r transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          {!isCollapsed && <h1 className="text-xl font-bold">POS System</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={`mb-1 w-full justify-start ${isCollapsed ? 'px-2' : ''}`}
                onClick={() => router.push(item.href)}
              >
                <item.icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-2'}`} />
                {!isCollapsed && item.label}
              </Button>
            ))}
          </div>
        </ScrollArea>
        {!isCollapsed && (
          <div className="mt-auto border-t p-3">
            <Button
              variant="ghost"
              className="text-destructive w-full justify-start"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
