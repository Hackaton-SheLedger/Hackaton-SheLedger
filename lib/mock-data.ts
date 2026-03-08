// Mock data for SheLedger demo

export interface User {
  id: string
  name: string
  phone: string
  businessType: string
  country: string
  createdAt: Date
}

export interface DailyRecord {
  id: string
  userId: string
  sales: number
  expenses: number
  savings: number
  paymentType: 'cash' | 'bank_transfer' | 'digital_payment'
  createdAt: Date
}

export interface Score {
  id: string
  userId: string
  score: number
  updatedAt: Date
}

export const mockUser: User = {
  id: '1',
  name: 'María García',
  phone: '+51 987 654 321',
  businessType: 'vendedora_comida',
  country: 'Perú',
  createdAt: new Date('2024-01-15'),
}

// Generate realistic mock records for the last 30 days
const generateMockRecords = (): DailyRecord[] => {
  const records: DailyRecord[] = []
  const paymentTypes: ('cash' | 'bank_transfer' | 'digital_payment')[] = [
    'cash',
    'bank_transfer',
    'digital_payment',
  ]

  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // Simulate realistic patterns - weekends slightly lower, some days skipped
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const skipDay = Math.random() > 0.85 // 15% chance to skip a day

    if (!skipDay) {
      const baseSales = isWeekend ? 80 : 120
      const sales = Math.round(baseSales + Math.random() * 60)
      const expenses = Math.round(sales * (0.3 + Math.random() * 0.3))
      const savings = Math.round((sales - expenses) * (0.1 + Math.random() * 0.15))

      records.push({
        id: `record-${i}`,
        userId: '1',
        sales,
        expenses,
        savings,
        paymentType: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
        createdAt: date,
      })
    }
  }

  return records
}

export const mockRecords = generateMockRecords()

// Calculate financial score based on rules
export const calculateScore = (records: DailyRecord[]): number => {
  let score = 50 // Base score

  if (records.length === 0) return score

  // Check for consecutive days of activity (last 7 days)
  const last7Days = records.slice(-7)
  const consecutiveDays = last7Days.length
  if (consecutiveDays >= 5) score += 10

  // Check savings rate
  const totalIncome = records.reduce((sum, r) => sum + r.sales, 0)
  const totalSavings = records.reduce((sum, r) => sum + r.savings, 0)
  const savingsRate = totalSavings / totalIncome
  if (savingsRate > 0.1) score += 15

  // Check income stability (compare last 2 weeks)
  const last14Days = records.slice(-14)
  const week1 = last14Days.slice(0, 7).reduce((sum, r) => sum + r.sales, 0)
  const week2 = last14Days.slice(7).reduce((sum, r) => sum + r.sales, 0)
  const incomeVariation = Math.abs(week1 - week2) / Math.max(week1, week2, 1)
  if (incomeVariation < 0.2) score += 20

  // Check expense ratio
  const totalExpenses = records.reduce((sum, r) => sum + r.expenses, 0)
  const expenseRatio = totalExpenses / totalIncome
  if (expenseRatio > 0.8) score -= 10

  // Bonus for consistent tracking
  if (records.length >= 20) score += 5

  return Math.min(100, Math.max(0, score))
}

export const mockScore: Score = {
  id: '1',
  userId: '1',
  score: calculateScore(mockRecords),
  updatedAt: new Date(),
}

// Helper functions
export const getWeeklyData = () => {
  const last7Days = mockRecords.slice(-7)
  return last7Days.map((record) => ({
    day: record.createdAt.toLocaleDateString('es', { weekday: 'short' }),
    sales: record.sales,
    expenses: record.expenses,
    profit: record.sales - record.expenses,
  }))
}

export const getExpenseBreakdown = () => {
  const totalSales = mockRecords.reduce((sum, r) => sum + r.sales, 0)
  const totalExpenses = mockRecords.reduce((sum, r) => sum + r.expenses, 0)
  const totalSavings = mockRecords.reduce((sum, r) => sum + r.savings, 0)
  const profit = totalSales - totalExpenses - totalSavings

  return [
    { name: 'Gastos', value: totalExpenses, fill: 'var(--chart-1)' },
    { name: 'Ahorros', value: totalSavings, fill: 'var(--chart-2)' },
    { name: 'Ganancia Neta', value: profit, fill: 'var(--chart-4)' },
  ]
}

export const getProfitTrend = () => {
  return mockRecords.slice(-14).map((record, index) => ({
    day: index + 1,
    profit: record.sales - record.expenses,
    sales: record.sales,
  }))
}

export const getActivityCalendar = () => {
  const calendar: { date: Date; hasActivity: boolean }[] = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    const hasActivity = mockRecords.some(
      (r) => r.createdAt.toDateString() === date.toDateString()
    )
    calendar.push({ date, hasActivity })
  }

  return calendar
}

export const getFinancialSummary = () => {
  const thisWeek = mockRecords.slice(-7)
  const totalSales = thisWeek.reduce((sum, r) => sum + r.sales, 0)
  const totalExpenses = thisWeek.reduce((sum, r) => sum + r.expenses, 0)
  const totalSavings = thisWeek.reduce((sum, r) => sum + r.savings, 0)
  const netProfit = totalSales - totalExpenses

  return {
    totalSales,
    totalExpenses,
    totalSavings,
    netProfit,
    expenseRatio: Math.round((totalExpenses / totalSales) * 100),
  }
}

export const getInsights = () => {
  const summary = getFinancialSummary()
  const insights: string[] = []

  if (summary.expenseRatio < 50) {
    insights.push('¡Excelente! Tus gastos están bien controlados esta semana.')
  } else if (summary.expenseRatio > 70) {
    insights.push(`Tus gastos representan el ${summary.expenseRatio}% de tus ventas. Considera reducir costos.`)
  }

  const savingsRate = Math.round((summary.totalSavings / summary.totalSales) * 100)
  if (savingsRate > 10) {
    insights.push(`Ahorraste el ${savingsRate}% de tus ingresos. ¡Excelente hábito de ahorro!`)
  }

  const consecutiveDays = mockRecords.slice(-5).length
  if (consecutiveDays >= 5) {
    insights.push('Has mantenido un registro constante de ventas esta semana.')
  }

  if (summary.netProfit > 0) {
    insights.push(`Tu ganancia neta esta semana es S/ ${summary.netProfit}. ¡Sigue así!`)
  }

  return insights
}

// Chat message parsing
export interface ParsedFinancialData {
  sales?: number
  expenses?: number
  savings?: number
}

export const parseFinancialMessage = (message: string): ParsedFinancialData | null => {
  const result: ParsedFinancialData = {}

  // Match patterns like "vendí 120", "gasté 40", "ahorré 20"
  const salesMatch = message.match(/(?:sold|vend[ií]|sales?|ventas?)\s*(?:de\s*)?(?:S\/\s*)?(\d+)/i)
  const expenseMatch = message.match(/(?:spent|gast[eé]|expense|gastos?)\s*(?:de\s*)?(?:S\/\s*)?(\d+)/i)
  const savingsMatch = message.match(/(?:saved?|ahorr[eé]|ahorros?)\s*(?:de\s*)?(?:S\/\s*)?(\d+)/i)

  if (salesMatch) result.sales = parseInt(salesMatch[1])
  if (expenseMatch) result.expenses = parseInt(expenseMatch[1])
  if (savingsMatch) result.savings = parseInt(savingsMatch[1])

  if (Object.keys(result).length > 0) {
    return result
  }

  // Try to match simple number patterns: "120 and 40" or "120, 40"
  const numbers = message.match(/\d+/g)
  if (numbers && numbers.length >= 2) {
    result.sales = parseInt(numbers[0])
    result.expenses = parseInt(numbers[1])
    if (numbers.length >= 3) {
      result.savings = parseInt(numbers[2])
    }
    return result
  }

  return null
}
