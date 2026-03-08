'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ActivityDay {
  date: Date
  hasActivity: boolean
}

interface ActivityTrackerProps {
  calendar: ActivityDay[]
}

export function ActivityTracker({ calendar }: ActivityTrackerProps) {
  const activeDays = calendar.filter((d) => d.hasActivity).length
  const streak = getStreak(calendar)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Registro de Actividad</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{activeDays}</p>
            <p className="text-xs text-muted-foreground">Días Activos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-safe">{streak}</p>
            <p className="text-xs text-muted-foreground">Racha</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-4">
              {Math.round((activeDays / 30) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground">Consistencia</p>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
            <div
              key={i}
              className="text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
          {calendar.map((day, index) => (
            <div
              key={index}
              className={cn(
                'aspect-square rounded-sm transition-colors',
                day.hasActivity
                  ? 'bg-primary hover:bg-primary/80'
                  : 'bg-muted hover:bg-muted/80'
              )}
              title={`${day.date.toLocaleDateString('es')} - ${
                day.hasActivity ? 'Registrado' : 'Sin registro'
              }`}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-muted" />
            <span>Sin Registro</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm bg-primary" />
            <span>Registrado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getStreak(calendar: ActivityDay[]): number {
  let streak = 0
  const reversed = [...calendar].reverse()

  for (const day of reversed) {
    if (day.hasActivity) {
      streak++
    } else {
      break
    }
  }

  return streak
}
