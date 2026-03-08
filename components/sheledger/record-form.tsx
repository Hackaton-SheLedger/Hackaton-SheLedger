'use client'

import { useState } from 'react'
import { Plus, DollarSign, Wallet, PiggyBank, CreditCard, Sparkles, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface RecordFormProps {
  onSubmit?: (data: {
    sales: number
    expenses: number
    savings: number
    paymentType: string
  }) => void
}

export function RecordForm({ onSubmit }: RecordFormProps) {
  const [sales, setSales] = useState('')
  const [expenses, setExpenses] = useState('')
  const [savings, setSavings] = useState('')
  const [paymentType, setPaymentType] = useState('cash')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showCoachFeedback, setShowCoachFeedback] = useState(false)
  const [isPlayingCoach, setIsPlayingCoach] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<{ sales: number; expenses: number; savings: number } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Save to API
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sales: parseFloat(sales) || 0,
          expenses: parseFloat(expenses) || 0,
          savings: parseFloat(savings) || 0
        })
      })

      if (!response.ok) throw new Error('Error al guardar')

      const transaction = {
        sales: parseFloat(sales) || 0,
        expenses: parseFloat(expenses) || 0,
        savings: parseFloat(savings) || 0
      }

      setLastTransaction(transaction)

      if (onSubmit) {
        onSubmit({
          ...transaction,
          paymentType,
        })
      }

      setSuccess(true)
      setShowCoachFeedback(true)
      
      setTimeout(() => {
        setSuccess(false)
        setSales('')
        setExpenses('')
        setSavings('')
        setPaymentType('cash')
      }, 3000)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar. Intenta de nuevo.')
    }

    setIsSubmitting(false)
  }

  const netProfit =
    (parseFloat(sales) || 0) - (parseFloat(expenses) || 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Plus className="h-5 w-5 text-primary" />
          Registrar Actividad Diaria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="sales" className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-safe" />
                Ventas (S/)
              </Label>
              <Input
                id="sales"
                type="number"
                min="0"
                step="0.01"
                value={sales}
                onChange={(e) => setSales(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenses" className="flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-destructive" />
                Gastos (S/)
              </Label>
              <Input
                id="expenses"
                type="number"
                min="0"
                step="0.01"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="savings" className="flex items-center gap-1.5">
                <PiggyBank className="h-3.5 w-3.5 text-primary" />
                Ahorros (S/)
              </Label>
              <Input
                id="savings"
                type="number"
                min="0"
                step="0.01"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentType" className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-chart-3" />
              Tipo de Pago
            </Label>
            <Select value={paymentType} onValueChange={setPaymentType}>
              <SelectTrigger id="paymentType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Efectivo</SelectItem>
                <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
                <SelectItem value="digital_payment">Pago Digital</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {sales && (
            <div
              className={cn(
                'rounded-lg p-3 text-sm',
                netProfit >= 0 ? 'bg-safe/10 text-safe' : 'bg-destructive/10 text-destructive'
              )}
            >
              <span className="font-medium">Ganancia Neta Estimada: </span>
              S/ {netProfit.toFixed(2)}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !sales}
          >
            {success ? (
              '¡Registrado Exitosamente!'
            ) : isSubmitting ? (
              'Registrando...'
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Registrar Actividad
              </>
            )}
          </Button>

          {showCoachFeedback && lastTransaction && (
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 border-primary/30 bg-primary/5"
              onClick={async () => {
                if (isPlayingCoach) return
                setIsPlayingCoach(true)
                
                try {
                  const response = await fetch('/api/voice/coach', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lastTransaction })
                  })
                  
                  if (response.headers.get('Content-Type')?.includes('audio/mpeg')) {
                    const audioBlob = await response.blob()
                    const audioUrl = URL.createObjectURL(audioBlob)
                    const audio = new Audio(audioUrl)
                    audio.onended = () => {
                      setIsPlayingCoach(false)
                      setShowCoachFeedback(false)
                      URL.revokeObjectURL(audioUrl)
                    }
                    audio.play()
                  } else {
                    const data = await response.json()
                    if ('speechSynthesis' in window) {
                      const utterance = new SpeechSynthesisUtterance(data.text)
                      utterance.lang = 'es-ES'
                      utterance.rate = 0.9
                      utterance.onend = () => {
                        setIsPlayingCoach(false)
                        setShowCoachFeedback(false)
                      }
                      speechSynthesis.speak(utterance)
                    }
                  }
                } catch {
                  setIsPlayingCoach(false)
                }
              }}
              disabled={isPlayingCoach}
            >
              {isPlayingCoach ? (
                <>
                  <Volume2 className="h-4 w-4 animate-pulse" />
                  Escuchando consejo...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Escuchar consejo de tu asesora
                </>
              )}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
