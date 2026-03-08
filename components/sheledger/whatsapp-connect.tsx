'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageCircle, Send, Check, Smartphone, ExternalLink, Copy, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WhatsAppConnectProps {
  className?: string
}

export function WhatsAppConnect({ className }: WhatsAppConnectProps) {
  const [phone, setPhone] = useState('+51979851414')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Twilio Sandbox number
  const whatsappNumber = '+14155238886'
  const sandboxCode = 'join early-building'

  const handleSendWelcome = async () => {
    if (!phone) {
      setError('Ingresa tu número de teléfono')
      return
    }

    setSending(true)
    setError('')

    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phone.replace(/\s/g, ''),
          message: `¡Bienvenida a SheLedger!\n\nAhora puedes registrar tus ventas y gastos por WhatsApp.\n\nPrueba enviando:\n"Vendí 100 soles hoy"\n\n¡Tu asistente financiera está lista!`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSent(true)
      } else {
        setError(data.error || 'Error al enviar. Asegúrate de unirte al sandbox primero.')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setSending(false)
    }
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent(sandboxCode)
    window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`, '_blank')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(sandboxCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-safe/10 pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageCircle className="h-5 w-5 text-safe" />
          Conectar WhatsApp
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {sent ? (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-safe/20">
              <Check className="h-6 w-6 text-safe" />
            </div>
            <p className="font-medium text-foreground">¡Mensaje enviado!</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Revisa tu WhatsApp en +51 979 851 414
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setSent(false)}
            >
              Enviar otro mensaje
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Step 1: Join Sandbox */}
            <div className="rounded-lg border-2 border-dashed border-safe/30 bg-safe/5 p-4">
              <p className="mb-2 text-sm font-medium text-foreground">
                Paso 1: Unirse al Sandbox de Twilio
              </p>
              <p className="text-xs text-muted-foreground">
                Envia este mensaje por WhatsApp al numero de Twilio:
              </p>
              
              <div className="mt-2 flex items-center gap-2 rounded bg-background p-2">
                <code className="flex-1 text-sm font-medium text-safe">{sandboxCode}</code>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyCode}>
                  {copied ? <CheckCircle2 className="h-4 w-4 text-safe" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Al numero: <span className="font-mono font-medium text-foreground">{whatsappNumber}</span>
              </p>
              
              <Button
                variant="default"
                size="sm"
                className="mt-3 w-full gap-2 bg-safe hover:bg-safe/90"
                onClick={openWhatsApp}
              >
                <ExternalLink className="h-4 w-4" />
                Abrir WhatsApp
              </Button>
            </div>

            {/* Step 2: Send welcome message */}
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="mb-2 text-sm font-medium text-foreground">
                Paso 2: Recibe mensaje de bienvenida
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Smartphone className="h-3.5 w-3.5" />
                  Tu numero de WhatsApp
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+51 979 851 414"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendWelcome}
                    disabled={sending}
                    className="gap-2"
                  >
                    {sending ? 'Enviando...' : <><Send className="h-4 w-4" /> Enviar</>}
                  </Button>
                </div>
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>
            </div>

            <div className="rounded-lg bg-primary/5 p-3">
              <p className="text-xs text-muted-foreground">
                <strong className="text-primary">Despues de unirte al sandbox:</strong> podras enviar mensajes como &quot;Vendi 150 soles&quot; o &quot;Gaste 40 en insumos&quot; y SheLedger los registrara automaticamente.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
