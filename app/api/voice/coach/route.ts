import { NextRequest, NextResponse } from 'next/server'
import { getFinancialSummary, calculateScore, getActivityStreak } from '@/lib/db'

// Generate intelligent financial coaching message
function generateCoachingMessage(
  summary: { totalSales: number; totalExpenses: number; netProfit: number; totalSavings: number; expenseRatio: number; totalRecords: number },
  score: number,
  streak: number,
  lastTransaction?: { sales: number; expenses: number; savings: number }
): string {
  const messages: string[] = []
  
  // Greeting based on time of day
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos dias' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'
  
  // If there's a recent transaction, comment on it
  if (lastTransaction) {
    const profit = lastTransaction.sales - lastTransaction.expenses
    
    if (lastTransaction.sales > 0 && lastTransaction.expenses > 0) {
      messages.push(`${greeting}! Registraste ventas de ${lastTransaction.sales} soles y gastos de ${lastTransaction.expenses} soles.`)
      
      if (profit > 0) {
        messages.push(`Tu ganancia de hoy es ${profit} soles.`)
        
        // Project weekly earnings
        const daysLeft = 7 - new Date().getDay()
        if (daysLeft > 0 && profit > 50) {
          const projected = Math.round(profit * daysLeft + summary.netProfit)
          messages.push(`Si mantienes este ritmo, podrias generar mas de ${projected} soles esta semana.`)
        }
      } else if (profit < 0) {
        messages.push(`Hoy tus gastos superaron tus ventas por ${Math.abs(profit)} soles. No te preocupes, manana es una nueva oportunidad.`)
      }
    } else if (lastTransaction.sales > 0) {
      messages.push(`${greeting}! Excelente, registraste ${lastTransaction.sales} soles en ventas.`)
      
      if (summary.totalSales > 500) {
        messages.push(`Ya llevas ${summary.totalSales} soles en ventas esta semana. Vas muy bien!`)
      }
    } else if (lastTransaction.savings > 0) {
      messages.push(`${greeting}! Que bien que estas ahorrando. ${lastTransaction.savings} soles guardados es un gran paso.`)
      
      const savingsRate = Math.round((summary.totalSavings / Math.max(summary.totalSales, 1)) * 100)
      if (savingsRate >= 10) {
        messages.push(`Estas ahorrando el ${savingsRate} por ciento de tus ingresos. Eso es excelente!`)
      }
    }
  } else {
    // General coaching without specific transaction
    messages.push(`${greeting}! Soy tu asesora financiera.`)
  }
  
  // Add insights based on overall performance
  if (summary.totalRecords >= 5) {
    // Expense ratio advice
    if (summary.expenseRatio > 70) {
      messages.push(`He notado que tus gastos representan el ${summary.expenseRatio} por ciento de tus ventas. Te sugiero revisar donde puedes reducir costos.`)
    } else if (summary.expenseRatio < 40) {
      messages.push(`Tus gastos estan muy bien controlados. Solo el ${summary.expenseRatio} por ciento de tus ventas. Excelente administracion!`)
    }
    
    // Score advice
    if (score >= 80) {
      messages.push(`Tu puntaje financiero es ${score} de 100. Eres una emprendedora excelente!`)
    } else if (score >= 60) {
      messages.push(`Tu puntaje es ${score} de 100. Vas por buen camino. Sigue registrando para mejorarlo.`)
    } else if (score < 50) {
      messages.push(`Tu puntaje actual es ${score}. Puedes mejorarlo ahorrando un poco cada dia y registrando tus ventas constantemente.`)
    }
  }
  
  // Streak encouragement
  if (streak >= 7) {
    messages.push(`Llevas ${streak} dias consecutivos registrando. Tu constancia es admirable!`)
  } else if (streak >= 3) {
    messages.push(`Van ${streak} dias seguidos registrando. Sigue asi para construir tu historial financiero.`)
  } else if (streak === 0 && summary.totalRecords > 0) {
    messages.push(`Recuerda registrar tus ventas todos los dias. La constancia mejora tu perfil financiero.`)
  }
  
  // Savings encouragement
  if (summary.totalSavings === 0 && summary.netProfit > 100) {
    messages.push(`Tienes buenas ganancias pero no has registrado ahorros. Intenta guardar aunque sea 10 soles diarios.`)
  }
  
  // Motivational closing
  const closings = [
    'Tu esfuerzo vale mucho. Sigue adelante!',
    'Cada sol que registras construye tu futuro financiero.',
    'Eres una emprendedora increible. No lo olvides!',
    'Tu negocio esta creciendo. Estoy orgullosa de ti!'
  ]
  
  if (messages.length > 1) {
    messages.push(closings[Math.floor(Math.random() * closings.length)])
  }
  
  return messages.join(' ')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const lastTransaction = body.lastTransaction as { sales: number; expenses: number; savings: number } | undefined
    
    // Get current financial data
    const [summary, score, streak] = await Promise.all([
      getFinancialSummary(),
      calculateScore(),
      getActivityStreak()
    ])
    
    // Generate coaching message
    const message = generateCoachingMessage(summary, score, streak, lastTransaction)
    
    // Check if ElevenLabs is configured
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json({ 
        text: message,
        audioAvailable: false 
      })
    }
    
    // Generate audio with ElevenLabs
    const voiceId = 'XB0fDUnXU5powFXDhCwa' // Charlotte - warm female voice
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: message,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.8,
            style: 0.4,
            use_speaker_boost: true
          }
        }),
      }
    )
    
    if (!response.ok) {
      console.error('ElevenLabs error:', await response.text())
      return NextResponse.json({ 
        text: message,
        audioAvailable: false 
      })
    }
    
    const audioBuffer = await response.arrayBuffer()
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'X-Coach-Message': encodeURIComponent(message)
      }
    })
  } catch (error) {
    console.error('Coach API error:', error)
    return NextResponse.json({ error: 'Error generando consejo' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const [summary, score, streak] = await Promise.all([
      getFinancialSummary(),
      calculateScore(),
      getActivityStreak()
    ])
    
    const message = generateCoachingMessage(summary, score, streak)
    
    return NextResponse.json({ 
      text: message,
      summary,
      score,
      streak
    })
  } catch (error) {
    console.error('Coach API error:', error)
    return NextResponse.json({ error: 'Error obteniendo datos' }, { status: 500 })
  }
}
