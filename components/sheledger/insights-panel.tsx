'use client'

import { Lightbulb, TrendingUp, AlertCircle, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface InsightsPanelProps {
  insights: string[]
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const getIcon = (index: number) => {
    const icons = [Lightbulb, TrendingUp, Sparkles, AlertCircle]
    const Icon = icons[index % icons.length]
    return <Icon className="h-4 w-4 shrink-0" />
  }

  const getIconColor = (index: number) => {
    const colors = ['text-chart-4', 'text-safe', 'text-primary', 'text-warning']
    return colors[index % colors.length]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-5 w-5 text-primary" />
          Consejos Financieros IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Comienza a registrar tu actividad diaria para recibir consejos personalizados.
          </p>
        ) : (
          insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3"
            >
              <div className={getIconColor(index)}>{getIcon(index)}</div>
              <p className="text-sm text-foreground">{insight}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
