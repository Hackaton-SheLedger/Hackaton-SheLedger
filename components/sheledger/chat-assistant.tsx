'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Volume2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { parseFinancialMessage, type ParsedFinancialData } from '@/lib/mock-data'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  data?: ParsedFinancialData
}

interface ChatAssistantProps {
  onRecordAdded?: (data: ParsedFinancialData) => void
  score?: number
  summary?: { totalSales: number; netProfit: number; totalRecords: number }
}

const quickReplies = [
  'Vendí 100 soles',
  'Gasté 50 en insumos',
  'Ahorré 30 soles',
  '¿Cómo va mi puntaje?',
]

export function ChatAssistant({ onRecordAdded, score = 50, summary }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        '¡Hola! Soy tu asistente de SheLedger. Puedes contarme sobre tus ventas y gastos diarios. Por ejemplo, di "Vendí 150 soles hoy y gasté 40 en insumos."',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const generateResponse = (data: ParsedFinancialData | null, originalMessage: string): string => {
    // Handle score question
    if (originalMessage.toLowerCase().includes('puntaje') || originalMessage.toLowerCase().includes('score')) {
      const label = score >= 80 ? 'Emprendedora Excelente' : score >= 60 ? 'Emprendedora Estable' : score >= 40 ? 'Emprendedora en Crecimiento' : 'Comenzando'
      const records = summary?.totalRecords || 0
      return `Tu puntaje actual es ${score}/100 (${label}). Has registrado ${records} transacciones esta semana. ${score < 80 ? 'Sigue registrando para mejorar tu perfil!' : 'Excelente trabajo!'}`
    }

    if (!data) {
      return "No entendí eso. Intenta decir algo como 'Vendí 100 y gasté 30 hoy.' También puedes usar los botones rápidos abajo."
    }

    const parts: string[] = []

    if (data.sales !== undefined) {
      parts.push(`ventas de S/ ${data.sales}`)
    }
    if (data.expenses !== undefined) {
      parts.push(`gastos de S/ ${data.expenses}`)
    }
    if (data.savings !== undefined) {
      parts.push(`ahorros de S/ ${data.savings}`)
    }

    const recorded = parts.join(', ')
    const profit = (data.sales || 0) - (data.expenses || 0)

    let response = `✅ ¡Registrado! Tus ${recorded}.`

    if (data.sales && data.expenses) {
      response += `\n\n💰 Ganancia neta: S/ ${profit}`
      if (profit > 50) {
        response += '\n🌟 ¡Excelente día!'
      } else if (profit > 0) {
        response += '\n👍 ¡Buen trabajo!'
      } else {
        response += '\n📊 Revisa tus gastos'
      }
    }

    if (data.savings && data.savings > 0) {
      response += '\n\n🐷 ¡Ahorrar es un gran hábito!'
    }

    return response
  }

  const speakMessage = async (text: string) => {
    // Clean text for speech (remove emojis)
    const cleanText = text.replace(/[📊✅💰🌟👍🐷\n]/g, ' ').trim()
    setIsSpeaking(true)
    
    try {
      // Try ElevenLabs first
      const response = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText })
      })
      
      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        audio.onended = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }
        audio.onerror = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }
        audio.play()
        return
      }
    } catch (error) {
      console.error('ElevenLabs error, falling back to Web Speech:', error)
    }
    
    // Fallback to Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.lang = 'es-ES'
      utterance.rate = 0.9
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    } else {
      setIsSpeaking(false)
    }
  }

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    const parsedData = parseFinancialMessage(messageText)
    let responseText = generateResponse(parsedData, messageText)

    // Save to database if we have data
    if (parsedData) {
      try {
        await fetch('/api/records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sales: parsedData.sales || 0,
            expenses: parsedData.expenses || 0,
            savings: parsedData.savings || 0
          })
        })
      } catch (error) {
        console.error('Error saving to DB:', error)
        responseText = 'Error al guardar. Intenta de nuevo.'
      }
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date(),
      data: parsedData || undefined,
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')

    if (parsedData && onRecordAdded) {
      onRecordAdded(parsedData)
    }

    // Auto-speak response
    setTimeout(() => speakMessage(responseText), 500)
  }

  const toggleRecording = () => {
    if (!isRecording) {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition =
          (window as unknown as { webkitSpeechRecognition: typeof window.SpeechRecognition }).webkitSpeechRecognition || window.SpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.lang = 'es-ES'
        recognition.continuous = false
        recognition.interimResults = false

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript
          setInput(transcript)
          setIsRecording(false)
          // Auto-send after voice input
          setTimeout(() => {
            handleSend(transcript)
          }, 500)
        }

        recognition.onerror = () => {
          setIsRecording(false)
        }

        recognition.onend = () => {
          setIsRecording(false)
        }

        recognition.start()
        setIsRecording(true)
      } else {
        alert('El reconocimiento de voz no está disponible en tu navegador.')
      }
    } else {
      setIsRecording(false)
    }
  }

  return (
    <div className="flex h-[600px] flex-col rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
      {/* Header - WhatsApp style */}
      <div className="flex items-center gap-3 bg-primary px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">SheLedger</h3>
          <p className="text-xs text-white/70">Tu asistente financiera</p>
        </div>
        <div className="h-2 w-2 animate-pulse rounded-full bg-safe" />
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'relative max-w-[85%] rounded-2xl px-4 py-2 shadow-sm',
                  message.role === 'user'
                    ? 'rounded-br-sm bg-primary text-primary-foreground'
                    : 'rounded-bl-sm bg-white text-foreground border border-border'
                )}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                {message.data && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {message.data.sales !== undefined && (
                      <span className="rounded-full bg-safe/20 px-2 py-0.5 text-xs font-medium text-safe">
                        +S/ {message.data.sales}
                      </span>
                    )}
                    {message.data.expenses !== undefined && (
                      <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-xs font-medium text-destructive">
                        -S/ {message.data.expenses}
                      </span>
                    )}
                    {message.data.savings !== undefined && (
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                        🐷 S/ {message.data.savings}
                      </span>
                    )}
                  </div>
                )}
                <div className="mt-1 flex items-center justify-end gap-1">
                  <span className="text-[10px] opacity-60">
                    {message.timestamp.toLocaleTimeString('es', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => speakMessage(message.content)}
                      disabled={isSpeaking}
                      className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <Volume2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Replies */}
      <div className="flex gap-2 overflow-x-auto px-4 py-2 border-t border-border bg-muted/30">
        {quickReplies.map((reply) => (
          <button
            key={reply}
            onClick={() => handleSend(reply)}
            className="shrink-0 rounded-full border border-primary/30 bg-white px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-muted/50 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2"
        >
          <Button
            type="button"
            variant={isRecording ? 'destructive' : 'ghost'}
            size="icon"
            onClick={toggleRecording}
            className={cn(
              'shrink-0 rounded-full',
              isRecording && 'animate-pulse'
            )}
          >
            {isRecording ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRecording ? 'Escuchando...' : 'Escribe tu mensaje...'}
            className="flex-1 rounded-full border-border bg-white"
            disabled={isRecording}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim()}
            className="shrink-0 rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
