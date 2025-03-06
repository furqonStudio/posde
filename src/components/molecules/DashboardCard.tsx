import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardCardProps {
  title: string
  icon: React.ComponentType<{ className?: string }>
  value: string | number
  description: string
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon: Icon,
  value,
  description,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent className="px-4">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-muted-foreground text-xs">{description}</p>
      </CardContent>
    </Card>
  )
}
