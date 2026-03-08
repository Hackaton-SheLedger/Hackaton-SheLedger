import { NextRequest, NextResponse } from 'next/server'
import { saveRecord, getFinancialSummary } from '@/lib/db'

export async function GET() {
  return new NextResponse('SheLedger Webhook OK', { status: 200 })
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const body = (formData.get('Body') as string) || ''
  const from = (formData.get('From') as string) || ''
  
  // Extract phone number (remove whatsapp: prefix)
  const phone = from.replace('whatsapp:', '')
  
  const numbers = body.match(/\d+/g)
  let msg = 'Hola! Envia: Vendi 100, Gaste 50, o Ahorre 20'
  
  let ventas = 0
  let gastos = 0
  let ahorros = 0

  if (body.toLowerCase().includes('vend') && numbers?.[0]) {
    ventas = parseInt(numbers[0])
    if (body.toLowerCase().includes('gast') && numbers[1]) {
      gastos = parseInt(numbers[1])
    }
  } else if (body.toLowerCase().includes('gast') && numbers?.[0]) {
    gastos = parseInt(numbers[0])
  } else if (body.toLowerCase().includes('ahorr') && numbers?.[0]) {
    ahorros = parseInt(numbers[0])
  }

  // Save to database if we have data
  if (ventas > 0 || gastos > 0 || ahorros > 0) {
    try {
      await saveRecord(phone, ventas, gastos, ahorros)
      const summary = await getFinancialSummary(phone)
      
      const ganancia = ventas - gastos
      msg = `Registrado! Ventas S/${ventas}, Gastos S/${gastos}`
      if (ganancia !== 0) msg += `, Ganancia S/${ganancia}`
      if (ahorros > 0) msg += `, Ahorros S/${ahorros}`
      msg += `. Total semana: S/${summary.totalSales} ventas, S/${summary.netProfit} ganancia.`
    } catch (error) {
      console.error('Error saving record:', error)
      msg = 'Error al guardar. Intenta de nuevo.'
    }
  }

  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${msg}</Message></Response>`,
    { status: 200, headers: { 'Content-Type': 'text/xml' } }
  )
}
