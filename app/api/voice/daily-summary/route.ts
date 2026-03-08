import { NextRequest, NextResponse } from 'next/server'
import { getFinancialSummary, calculateScore } from '@/lib/db'

const VOICE_ID = 'FGY2WhTYpPnrIDTdsKH5'
const MODEL_ID = 'eleven_multilingual_v2'

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
          style: 0.5,
          use_speaker_boost: true
        }
      }),
    }
  )

  if (!response.ok) return null
  return response.arrayBuffer()
}

function generateDailySummaryText(summary: {
  totalSales: number
  totalExpenses: number
  netProfit: number
  totalSavings: number
  totalRecords: number
}, score: number): string {
  const greeting = new Date().getHours() < 12 ? 'Buenos dias' : 
                   new Date().getHours() < 18 ? 'Buenas tardes' : 'Buenas noches'
  
  let message = `${greeting}! Soy tu asistente de SheLedger. `
  
  if (summary.totalRecords === 0) {
    message += `Aun no tienes registros esta semana. Recuerda registrar tus ventas y gastos para construir tu historial financiero.`
  } else {
    message += `Esta semana has registrado ${summary.totalRecords} transacciones. `
    message += `Tus ventas totales son ${summary.totalSales} soles, `
    message += `con gastos de ${summary.totalExpenses} soles. `
    
    if (summary.netProfit > 0) {
      message += `Tu ganancia neta es de ${summary.netProfit} soles. `
    } else {
      message += `Tus gastos superaron tus ventas por ${Math.abs(summary.netProfit)} soles. `
    }
    
    if (summary.totalSavings > 0) {
      message += `Has ahorrado ${summary.totalSavings} soles. Excelente habito! `
    }
    
    // Score feedback
    if (score >= 80) {
      message += `Tu puntaje financiero es ${score} puntos. Eres una emprendedora excelente!`
    } else if (score >= 60) {
      message += `Tu puntaje financiero es ${score} puntos. Vas muy bien, sigue asi!`
    } else if (score >= 40) {
      message += `Tu puntaje financiero es ${score} puntos. Estas creciendo, no te detengas!`
    } else {
      message += `Tu puntaje financiero es ${score} puntos. Cada registro cuenta para mejorar tu perfil!`
    }
  }
  
  return message
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get('phone') || undefined
  const format = searchParams.get('format') || 'audio'

  try {
    const [summary, score] = await Promise.all([
      getFinancialSummary(phone),
      calculateScore(phone)
    ])

    const text = generateDailySummaryText(summary, score)

    if (format === 'text') {
      return NextResponse.json({ text, summary, score })
    }

    const audio = await generateAudio(text)
    
    if (!audio) {
      return NextResponse.json({ text, summary, score, audioError: true })
    }

    return new NextResponse(audio, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audio.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('Daily summary error:', error)
    return NextResponse.json({ error: 'Error generating summary' }, { status: 500 })
  }
}
