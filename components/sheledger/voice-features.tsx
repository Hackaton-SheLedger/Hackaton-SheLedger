'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Volume2, VolumeX, Play, Pause, Sun, Bell, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoiceFeaturesProps {
  className?: string
  summary?: {
    totalSales: number
    totalExpenses: number
    netProfit: number
    totalSavings: number
    totalRecords: number
  }
  score?: number
}

export function DailySummaryPlayer({ className, summary, score }: VoiceFeaturesProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [summaryText, setSummaryText] = useState<string | null>(null)
  const [summaryData, setSummaryData] = useState<{ totalSales: number; totalExpenses: number; netProfit: number; totalSavings: number; totalRecords: number } | null>(null)
  const [currentScore, setCurrentScore] = useState<number>(50)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  // Update local state when props change
  useEffect(() => {
    if (summary) {
      setSummaryData(summary)
    }
    if (score !== undefined) {
      setCurrentScore(score)
    }
  }, [summary, score])

  const playDailySummary = async () => {
    if (isPlaying && audio) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    setIsLoading(true)
    try {
      // First get the text version with fresh data
      const textResponse = await fetch('/api/voice/daily-summary?format=text')
      const textData = await textResponse.json()
      setSummaryText(textData.text)
      setSummaryData(textData.summary)
      setCurrentScore(textData.score)

      // Then get the audio
      const audioResponse = await fetch('/api/voice/daily-summary?format=audio')
      
      if (audioResponse.ok && audioResponse.headers.get('Content-Type')?.includes('audio')) {
        const audioBlob = await audioResponse.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const newAudio = new Audio(audioUrl)
        
        newAudio.onended = () => {
          setIsPlaying(false)
          URL.revokeObjectURL(audioUrl)
        }
        newAudio.onerror = () => {
          setIsPlaying(false)
          URL.revokeObjectURL(audioUrl)
        }
        
        setAudio(newAudio)
        newAudio.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Error playing summary:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sun className="h-5 w-5 text-amber-500" />
          Resumen del Dia
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className="mb-4 text-sm text-muted-foreground">
          Escucha un resumen personalizado de tu actividad financiera con voz natural.
        </p>
        
        <Button
          onClick={playDailySummary}
          disabled={isLoading}
          className="w-full gap-2"
          variant={isPlaying ? 'secondary' : 'default'}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Generando audio...
            </>
          ) : isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              Pausar
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Escuchar Resumen
            </>
          )}
        </Button>

        {summaryData && (
          <div className="mt-4 space-y-2 rounded-lg bg-muted/50 p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Ventas</p>
                <p className="font-semibold text-safe">S/ {summaryData.totalSales}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Gastos</p>
                <p className="font-semibold text-destructive">S/ {summaryData.totalExpenses}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ganancia</p>
                <p className={cn("font-semibold", summaryData.netProfit >= 0 ? "text-safe" : "text-destructive")}>
                  S/ {summaryData.netProfit}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Puntaje</p>
                <p className="font-semibold text-primary">{currentScore}/100</p>
              </div>
            </div>
            {summaryText && (
              <p className="mt-2 border-t border-border pt-2 text-xs text-muted-foreground italic">{summaryText}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MotivationalAlert({ className, summary, score }: VoiceFeaturesProps) {
  const [alert, setAlert] = useState<{ message: string; type: string } | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasNewAlert, setHasNewAlert] = useState(false)

  useEffect(() => {
    // Check for new alerts on mount and when data changes
    checkAlerts()
  }, [summary, score])

  const checkAlerts = async () => {
    try {
      const response = await fetch('/api/voice/motivational?format=text')
      const data = await response.json()
      
      if (data.primaryMessage) {
        setAlert({ message: data.primaryMessage, type: data.alerts?.[0]?.type || 'encouragement' })
        setHasNewAlert(true)
      }
    } catch (error) {
      console.error('Error checking alerts:', error)
    }
  }

  const playAlert = async () => {
    if (!alert) return
    
    setIsPlaying(true)
    setHasNewAlert(false)
    
    try {
      const response = await fetch('/api/voice/motivational?format=audio')
      
      if (response.ok && response.headers.get('Content-Type')?.includes('audio')) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        
        audio.onended = () => {
          setIsPlaying(false)
          URL.revokeObjectURL(audioUrl)
        }
        audio.onerror = () => {
          setIsPlaying(false)
          URL.revokeObjectURL(audioUrl)
        }
        
        audio.play()
      }
    } catch (error) {
      console.error('Error playing alert:', error)
      setIsPlaying(false)
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'streak': return '🔥'
      case 'savings_goal': return '🐷'
      case 'profit_milestone': return '💰'
      case 'score_improvement': return '📈'
      default: return '💜'
    }
  }

  if (!alert) {
    return null
  }

  return (
    <Card className={cn('overflow-hidden', hasNewAlert && 'ring-2 ring-primary ring-offset-2', className)}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className={cn('h-5 w-5 text-primary', hasNewAlert && 'animate-bounce')} />
          Mensaje Motivacional
          {hasNewAlert && (
            <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              Nuevo
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4 flex items-start gap-3">
          <span className="text-2xl">{getAlertIcon(alert.type)}</span>
          <p className="flex-1 text-sm text-foreground">{alert.message}</p>
        </div>
        
        <Button
          onClick={playAlert}
          disabled={isPlaying}
          variant="outline"
          className="w-full gap-2"
        >
          {isPlaying ? (
            <>
              <VolumeX className="h-4 w-4" />
              Reproduciendo...
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
              Escuchar
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export function VoiceAssistantBadge() {
  return (
    <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 px-3 py-1.5">
      <Sparkles className="h-4 w-4 text-primary" />
      <span className="text-xs font-medium text-primary">Voz con IA por ElevenLabs</span>
    </div>
  )
}
