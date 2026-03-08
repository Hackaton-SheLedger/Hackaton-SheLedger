import { NextRequest, NextResponse } from 'next/server'
import { getRecords, getWeeklyData, getFinancialSummary, calculateScore, saveRecord } from '@/lib/db'

export async function GET() {
  try {
    const [records, weeklyData, summary, score] = await Promise.all([
      getRecords(),
      getWeeklyData(),
      getFinancialSummary(),
      calculateScore()
    ])

    return NextResponse.json({
      records,
      weeklyData,
      summary,
      score
    })
  } catch (error) {
    console.error('Error fetching records:', error)
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sales, expenses, savings } = await request.json()
    
    // Use a default phone for web app entries
    const phone = '+51000000000'
    await saveRecord(phone, sales || 0, expenses || 0, savings || 0, 'web')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving record:', error)
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }
}
