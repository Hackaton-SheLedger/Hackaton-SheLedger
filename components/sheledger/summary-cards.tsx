'use client'

import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SummaryCardsProps {
  totalSales: number
  totalExpenses: number
  netProfit: number
  totalSavings: number
}

export function SummaryCards({
  totalSales,
  totalExpenses,
  netProfit,
  totalSavings,
}: SummaryCardsProps) {
  const cards = [
    {
      title: 'Ventas Esta Semana',
      value: totalSales,
      icon: TrendingUp,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Total Gastos',
      value: totalExpenses,
      icon: TrendingDown,
      trend: '-5%',
      trendUp: false,
    },
    {
      title: 'Ganancia Neta',
      value: netProfit,
      icon: Wallet,
      trend: '+18%',
      trendUp: true,
    },
    {
      title: 'Total Ahorros',
      value: totalSavings,
      icon: PiggyBank,
      trend: '+8%',
      trendUp: true,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">S/ {card.value}</span>
              <span
                className={`text-xs font-medium ${
                  card.trendUp ? 'text-safe' : 'text-destructive'
                }`}
              >
                {card.trend}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">vs semana pasada</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
