'use client'
import { DashboardCard } from '@/components/molecules/DashboardCard'
import { DashboardListCard } from '@/components/molecules/DashboardListCard'
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react'

const DashboardPage = () => {
  return (
    <div className="w-full overflow-scroll p-4">
      <h2 className="text-lg font-medium">Dashboard</h2>

      <div className="mt-4 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4">
          <DashboardCard
            title="Revenue"
            icon={DollarSign}
            value="Rp. 325.000"
            description="+20.1% from last month"
          />
          <DashboardCard
            title="Sales"
            icon={ShoppingBag}
            value="+2350"
            description="+10.5% from last month"
          />
          <DashboardCard
            title="Orders"
            icon={TrendingUp}
            value="150"
            description="+5% from last month"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DashboardListCard
            title="Recent Sales"
            description="You made 265 sales this month"
            items={[1, 2, 3, 4, 5].map((i) => ({
              id: i,
              icon: (
                <div className="bg-primary/10 mr-3 flex h-9 w-9 items-center justify-center rounded-full">
                  <span className="text-primary font-medium">C{i}</span>
                </div>
              ),
              primaryText: `Customer ${i}`,
              secondaryText: `customer${i}@example.com`,
              value: `$${(Math.random() * 100).toFixed(2)}`,
            }))}
          />
          <DashboardListCard
            title="Popular Products"
            description="Top selling products this month"
            items={[1, 2, 3, 4, 5].map((i) => ({
              id: i,
              icon: (
                <div className="mr-3 flex h-9 w-9 items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                  <span className="text-xs font-medium">P{i}</span>
                </div>
              ),
              primaryText: `Product ${i}`,
              secondaryText: `${Math.floor(Math.random() * 100)} units sold`,
              value: `$${(Math.random() * 100).toFixed(2)}`,
            }))}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
