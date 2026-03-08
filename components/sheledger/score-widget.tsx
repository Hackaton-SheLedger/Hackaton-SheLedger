'use client'

import { useEffect, useState } from 'react'

interface ScoreWidgetProps {
  score: number
}

export function ScoreWidget({ score }: ScoreWidgetProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = score / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setAnimatedScore(score)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.round(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [score])

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Emprendedora Excelente'
    if (s >= 60) return 'Emprendedora Estable'
    if (s >= 40) return 'Emprendedora en Crecimiento'
    return 'Comenzando'
  }

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-safe'
    if (s >= 60) return 'text-primary'
    if (s >= 40) return 'text-warning'
    return 'text-muted-foreground'
  }

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-card p-6 shadow-sm border border-border">
      <h3 className="text-sm font-medium text-muted-foreground">Puntaje Financiero</h3>
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-primary transition-all duration-1000"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {animatedScore}
          </span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <span className={`text-sm font-medium ${getScoreColor(score)}`}>
        {getScoreLabel(score)}
      </span>
    </div>
  )
}
