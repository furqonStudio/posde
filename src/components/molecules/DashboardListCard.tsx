import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface DashboardListCardProps {
  title: string
  description: string
  items: {
    id: number
    icon: React.ReactNode
    primaryText: string
    secondaryText: string
    value: string
  }[]
}

export const DashboardListCard: React.FC<DashboardListCardProps> = ({
  title,
  description,
  items,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center">
              {item.icon}
              <div className="flex-1">
                <div className="text-sm font-medium">{item.primaryText}</div>
                <div className="text-muted-foreground text-xs">
                  {item.secondaryText}
                </div>
              </div>
              <div className="font-medium">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
