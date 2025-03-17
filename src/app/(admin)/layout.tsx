import { SideBar } from '@/components/organism/SideBar'
import { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen">
      <SideBar />
      {children}
    </div>
  )
}

export default layout
