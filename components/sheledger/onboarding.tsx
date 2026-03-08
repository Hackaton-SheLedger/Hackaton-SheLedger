'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  MessageCircle, 
  TrendingUp, 
  Shield, 
  Sparkles,
  ArrowRight,
  Check,
  Smartphone
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingProps {
  onComplete: () => void
}

const steps = [
  {
    icon: MessageCircle,
    title: '¡Bienvenida a SheLedger!',
    subtitle: 'Tu asistente financiera personal',
    description: 'Registra tus ventas y gastos diarios de forma simple, por voz o texto. Construye tu historial financiero alternativo.',
    image: '💜',
  },
  {
    icon: Smartphone,
    title: 'Usa WhatsApp',
    subtitle: 'Tan fácil como enviar un mensaje',
    description: 'Envía mensajes como "Vendí 150 soles hoy" o "Gasté 40 en insumos" y nosotros hacemos el resto.',
    image: '📱',
  },
  {
    icon: TrendingUp,
    title: 'Construye tu Puntaje',
    subtitle: 'Tu perfil financiero alternativo',
    description: 'Mientras más registres, mejor será tu puntaje. Esto te ayudará a acceder a oportunidades financieras.',
    image: '📈',
  },
  {
    icon: Shield,
    title: 'Accede a Oportunidades',
    subtitle: 'Microcréditos y más',
    description: 'Un buen puntaje te abre puertas a microcréditos, seguros y otros servicios financieros.',
    image: '🌟',
  },
]

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const step = steps[currentStep]
  const Icon = step.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md overflow-hidden border-none shadow-2xl">
        <CardContent className="p-0">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 bg-primary/5 py-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-2 w-2 rounded-full transition-all duration-300',
                  index === currentStep
                    ? 'w-6 bg-primary'
                    : index < currentStep
                    ? 'bg-primary/60'
                    : 'bg-muted'
                )}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex flex-col items-center px-6 py-8 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl">
              {step.image}
            </div>

            <div className="mb-2 flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">{step.title}</h2>
            </div>

            <p className="mb-4 text-sm font-medium text-primary">{step.subtitle}</p>

            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>

            {/* Features list for first step */}
            {currentStep === 0 && (
              <div className="mb-6 w-full space-y-2 text-left">
                {[
                  'Registra ventas por voz o texto',
                  'Visualiza tus ganancias',
                  'Construye tu historial financiero',
                  'Accede a microcréditos',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-safe" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* WhatsApp instruction for step 2 */}
            {currentStep === 1 && (
              <div className="mb-6 w-full rounded-xl bg-safe/10 p-4">
                <p className="text-sm font-medium text-safe">
                  Número de WhatsApp:
                </p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  +51 999 888 777
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  (Guarda este número para empezar)
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex w-full gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Atrás
                </Button>
              )}
              <Button className="flex-1 gap-2" onClick={handleNext}>
                {currentStep === steps.length - 1 ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Comenzar
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {currentStep === 0 && (
              <button
                onClick={handleSkip}
                className="mt-4 text-xs text-muted-foreground hover:text-foreground"
              >
                Saltar introducción
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
