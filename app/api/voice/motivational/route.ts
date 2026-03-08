import { NextRequest, NextResponse } from 'next/server'
import { getFinancialSummary, calculateScore, getActivityStreak } from '@/lib/db'

const VOICE_ID = 'FGY2WhTYpPnrIDTdsKH5'
const MODEL_ID = 'eleven_multilingual_v2'

type AlertType = 'streak' | 'savings_goal' | 'profit_milestone' | 'score_improvement' | 'encouragement'

interface Alert {
  type: AlertType
  message: string
  triggered: boolean
}

async function generateAudio(text: string): Promise<ArrayBuffer | null> {
  if (!process.env.ELEVENLABS_API_KEY) return null

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.6,
          use_speaker_boost: true
        }
      }),
    }
  )

  if (!response.ok) return null
  return response.arrayBuffer()
}

function checkAlerts(summary: {
  totalSales: number
  totalExpenses: number
  netProfit: number
  totalSavings: number
  totalRecords: number
}, score: number, streak: number): Alert[] {
  const alerts: Alert[] = []

  // Streak alerts
  if (streak === 3) {
    alerts.push({
      type: 'streak',
      message: 'Felicidades! Llevas 3 dias consecutivos registrando. Estas creando un gran habito!',
      triggered: true
    })
  } else if (streak === 7) {
    alerts.push({
      type: 'streak',
      message: 'Increible! Una semana completa registrando tus finanzas. Eres una emprendedora comprometida!',
      triggered: true
    })
  } else if (streak === 14) {
    alerts.push({
      type: 'streak',
      message: 'Dos semanas de constancia! Tu historial financiero esta creciendo. Los bancos notaran tu compromiso!',
      triggered: true
    })
  }

  // Savings milestone
  if (summary.totalSavings >= 100 && summary.totalSavings < 150) {
    alerts.push({
      type: 'savings_goal',
      message: 'Alcanzaste 100 soles en ahorros esta semana! Ahorrar es el primer paso hacia la independencia financiera.',
      triggered: true
    })
  } else if (summary.totalSavings >= 500) {
    alerts.push({
      type: 'savings_goal',
      message: 'Wow! 500 soles ahorrados. Eres un ejemplo de disciplina financiera!',
      triggered: true
    })
  }

  // Profit milestone
  if (summary.netProfit >= 500 && summary.netProfit < 600) {
    alerts.push({
      type: 'profit_milestone',
      message: 'Tu ganancia supero los 500 soles esta semana! Tu negocio esta creciendo.',
      triggered: true
    })
  } else if (summary.netProfit >= 1000) {
    alerts.push({
      type: 'profit_milestone',
      message: 'Mil soles de ganancia! Eres una emprendedora exitosa. Sigue asi!',
      triggered: true
    })
  }

  // Score improvement
  if (score >= 80) {
    alerts.push({
      type: 'score_improvement',
      message: 'Tu puntaje financiero es excelente! Con este historial, pronto podras acceder a creditos formales.',
      triggered: true
    })
  } else if (score >= 60 && score < 65) {
    alerts.push({
      type: 'score_improvement',
      message: 'Tu puntaje subio a nivel estable! Cada registro te acerca mas a tus metas financieras.',
      triggered: true
    })
  }

  // Encouragement if no other alerts
  if (alerts.length === 0 && summary.totalRecords > 0) {
    const encouragements = [
      'Cada venta que registras construye tu futuro financiero. Sigue adelante!',
      'Tu esfuerzo diario vale mucho. Eres una emprendedora valiente!',
      'Registrar tus finanzas te da poder sobre tu dinero. Bien hecho!',
      'Tu constancia te abrira puertas. No te rindas!'
    ]
    alerts.push({
      type: 'encouragement',
      message: encouragements[Math.floor(Math.random() * encouragements.length)],
      triggered: true
    })
  }

  return alerts
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get('phone') || undefined
  const format = searchParams.get('format') || 'audio'

  try {
    const [summary, score, streak] = await Promise.all([
      getFinancialSummary(phone),
      calculateScore(phone),
      getActivityStreak(phone)
    ])

    const alerts = checkAlerts(summary, score, streak)
    
    if (alerts.length === 0) {
      return NextResponse.json({ alerts: [], message: 'No alerts' })
    }

    const primaryAlert = alerts[0]
    
    if (format === 'text') {
      return NextResponse.json({ alerts, primaryMessage: primaryAlert.message })
    }

    const audio = await generateAudio(primaryAlert.message)
    
    if (!audio) {
      return NextResponse.json({ alerts, primaryMessage: primaryAlert.message, audioError: true })
    }

    return new NextResponse(audio, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audio.byteLength.toString(),
        'X-Alert-Type': primaryAlert.type,
        'X-Alert-Count': alerts.length.toString(),
      },
    })
  } catch (error) {
    console.error('Motivational alert error:', error)
    return NextResponse.json({ error: 'Error generating alert' }, { status: 500 })
  }
}
