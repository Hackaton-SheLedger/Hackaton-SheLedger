'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mic, Volume2, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FinancialCoachProps {
  className?: string
  lastTransaction?: { sales: number; expenses: number; savings: number }
  onCoachingComplete?: () => void
}

export function FinancialCoach({ className, lastTransaction, onCoachingComplete }: FinancialCoachProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [coachMessage, setCoachMessage] = useState<string | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const getCoaching = async () => {
    if (isPlaying && audio) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    setIsLoading(true)
    setCoachMessage(null)

    try {
      const response = await fetch('/api/voice/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastTransaction })
      })

      if (!response.ok) {
        throw new Error('Error obteniendo consejo')
      }

      const contentType = response.headers.get('Content-Type')
      
      if (contentType?.includes('audio/mpeg')) {
        // Got audio response
        const message = decodeURIComponent(response.headers.get('X-Coach-Message') || '')
        setCoachMessage(message)
        
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const newAudio = new Audio(audioUrl)
        
        newAudio.onended = () => {
          setIsPlaying(false)
          URL.revokeObjectURL(audioUrl)
          onCoachingComplete?.()
        }
        
        newAudio.onerror = () => {
          setIsPlaying(false)
          URL.revokeObjectURL(audioUrl)
        }
        
        setAudio(newAudio)
        setIsPlaying(true)
        newAudio.play()
      } else {
        // Got text response (no audio)
        const data = await response.json()
        setCoachMessage(data.text)
        
        // Fallback to Web Speech API
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.text)
          utterance.lang = 'es-ES'
          utterance.rate = 0.9
          utterance.onend = () => {
            setIsPlaying(false)
            onCoachingComplete?.()
          }
          setIsPlaying(true)
          speechSynthesis.speak(utterance)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setCoachMessage('No pude conectarme. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={cn('overflow-hidden border-primary/20', className)}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-5 w-5 text-primary" />
          Asesora Financiera IA
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className="mb-4 text-sm text-muted-foreground">
          Recibe consejos personalizados sobre tus finanzas con voz natural.
        </p>
        
        <Button
          onClick={getCoaching}
          disabled={isLoading}
          className={cn(
            'w-full gap-2',
            isPlaying && 'bg-primary/80'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analizando tus finanzas...
            </>
          ) : isPlaying ? (
            <>
              <Volume2 className="h-4 w-4 animate-pulse" />
              Escuchando... (clic para pausar)
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Escuchar Consejo Personalizado
            </>
          )}
        </Button>

        {coachMessage && (
          <div className="mt-4 rounded-lg bg-muted/50 p-3">
            <p className="text-sm italic text-muted-foreground leading-relaxed">
              "{coachMessage}"
            </p>
          </div>
        )}

        {isPlaying && (
          <div className="mt-3 flex justify-center">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-1 animate-pulse rounded-full bg-primary"
                  style={{ 
                    animationDelay: `${i * 0.15}s`,
                    height: `${Math.random() * 16 + 8}px`
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Mini version for after-record feedback
export function CoachFeedback({ 
  transaction,
  onComplete 
}: { 
  transaction: { sales: number; expenses: number; savings: number }
  onComplete?: () => void 
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)

  const playFeedback = async () => {
    if (hasPlayed || isPlaying) return
    
    setIsPlaying(true)

    try {
      const response = await fetch('/api/voice/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastTransaction: transaction })
      })

      if (response.headers.get('Content-Type')?.includes('audio/mpeg')) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        
        audio.onended = () => {
          setIsPlaying(false)
          setHasPlayed(true)
          URL.revokeObjectURL(audioUrl)
          onComplete?.()
        }
        
        audio.play()
      } else {
        const data = await response.json()
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.text)
          utterance.lang = 'es-ES'
          utterance.rate = 0.9
          utterance.onend = () => {
            setIsPlaying(false)
            setHasPlayed(true)
            onComplete?.()
          }
          speechSynthesis.speak(utterance)
        }
      }
    } catch {
      setIsPlaying(false)
    }
  }

  if (hasPlayed) return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={playFeedback}
      disabled={isPlaying}
      className="mt-2 gap-2"
    >
      {isPlaying ? (
        <>
          <Volume2 className="h-3 w-3 animate-pulse" />
          Escuchando consejo...
        </>
      ) : (
        <>
          <Sparkles className="h-3 w-3" />
          Escuchar consejo de tu asesora
        </>
      )}
    </Button>
  )
}
