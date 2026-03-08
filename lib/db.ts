import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export interface DbRecord {
  id: number
  phone: string
  sales: number
  expenses: number
  savings: number
  created_at: Date
}

// Get or create user by phone
export async function getOrCreateUser(phone: string) {
  const existing = await sql`SELECT * FROM users WHERE phone = ${phone}`
  if (existing.length > 0) return existing[0]
  
  const result = await sql`
    INSERT INTO users (phone) VALUES (${phone})
    RETURNING *
  `
  return result[0]
}

// Save a record
export async function saveRecord(phone: string, sales: number, expenses: number, savings: number, source: string = 'whatsapp') {
  const user = await getOrCreateUser(phone)
  const result = await sql`
    INSERT INTO records (user_id, phone, sales, expenses, savings, source)
    VALUES (${user.id}, ${phone}, ${sales}, ${expenses}, ${savings}, ${source})
    RETURNING *
  `
  return result[0]
}

// Get all records (last 30 days)
export async function getRecords(phone?: string) {
  if (phone) {
    return await sql`
      SELECT r.* FROM records r
      JOIN users u ON r.user_id = u.id
      WHERE u.phone = ${phone}
      AND r.created_at >= NOW() - INTERVAL '30 days'
      ORDER BY r.created_at DESC
    `
  }
  return await sql`
    SELECT * FROM records
    WHERE created_at >= NOW() - INTERVAL '30 days'
    ORDER BY created_at DESC
  `
}

// Get weekly data for charts
export async function getWeeklyData(phone?: string) {
  const query = phone 
    ? sql`
        SELECT 
          DATE(r.created_at) as date,
          SUM(r.sales) as sales,
          SUM(r.expenses) as expenses,
          SUM(r.savings) as savings
        FROM records r
        JOIN users u ON r.user_id = u.id
        WHERE u.phone = ${phone}
        AND r.created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(r.created_at)
        ORDER BY date
      `
    : sql`
        SELECT 
          DATE(created_at) as date,
          SUM(sales) as sales,
          SUM(expenses) as expenses,
          SUM(savings) as savings
        FROM records
        WHERE created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date
      `
  return query
}

// Get financial summary
export async function getFinancialSummary(phone?: string) {
  const query = phone
    ? sql`
        SELECT 
          COALESCE(SUM(r.sales), 0) as total_sales,
          COALESCE(SUM(r.expenses), 0) as total_expenses,
          COALESCE(SUM(r.savings), 0) as total_savings,
          COUNT(*) as total_records
        FROM records r
        JOIN users u ON r.user_id = u.id
        WHERE u.phone = ${phone}
        AND r.created_at >= NOW() - INTERVAL '7 days'
      `
    : sql`
        SELECT 
          COALESCE(SUM(sales), 0) as total_sales,
          COALESCE(SUM(expenses), 0) as total_expenses,
          COALESCE(SUM(savings), 0) as total_savings,
          COUNT(*) as total_records
        FROM records
        WHERE created_at >= NOW() - INTERVAL '7 days'
      `
  const result = await query
  const data = result[0]
  
  return {
    totalSales: Number(data.total_sales),
    totalExpenses: Number(data.total_expenses),
    totalSavings: Number(data.total_savings),
    netProfit: Number(data.total_sales) - Number(data.total_expenses),
    totalRecords: Number(data.total_records),
    expenseRatio: data.total_sales > 0 
      ? Math.round((Number(data.total_expenses) / Number(data.total_sales)) * 100)
      : 0
  }
}

// Calculate score
export async function calculateScore(phone?: string) {
  const summary = await getFinancialSummary(phone)
  const streak = await getActivityStreak(phone)
  let score = 50
  
  if (summary.totalRecords >= 5) score += 10
  if (summary.totalSavings > 0) score += 15
  if (summary.expenseRatio < 50) score += 15
  if (summary.netProfit > 0) score += 10
  if (streak >= 3) score += 5
  if (streak >= 7) score += 5
  
  return Math.min(100, Math.max(0, score))
}

// Get activity streak (consecutive days with records)
export async function getActivityStreak(phone?: string) {
  const query = phone
    ? sql`
        SELECT DISTINCT DATE(r.created_at) as date
        FROM records r
        JOIN users u ON r.user_id = u.id
        WHERE u.phone = ${phone}
        AND r.created_at >= NOW() - INTERVAL '30 days'
        ORDER BY date DESC
      `
    : sql`
        SELECT DISTINCT DATE(created_at) as date
        FROM records
        WHERE created_at >= NOW() - INTERVAL '30 days'
        ORDER BY date DESC
      `
  
  const result = await query
  if (result.length === 0) return 0
  
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < result.length; i++) {
    const recordDate = new Date(result[i].date)
    recordDate.setHours(0, 0, 0, 0)
    
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)
    
    if (recordDate.getTime() === expectedDate.getTime()) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

// Get activity calendar (last 30 days)
export async function getActivityCalendar(phone?: string) {
  const query = phone
    ? sql`
        SELECT DISTINCT DATE(r.created_at) as date
        FROM records r
        JOIN users u ON r.user_id = u.id
        WHERE u.phone = ${phone}
        AND r.created_at >= NOW() - INTERVAL '30 days'
      `
    : sql`
        SELECT DISTINCT DATE(created_at) as date
        FROM records
        WHERE created_at >= NOW() - INTERVAL '30 days'
      `
  
  const result = await query
  const activeDates = new Set(result.map(r => new Date(r.date).toISOString().split('T')[0]))
  
  const calendar = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    calendar.push({
      date,
      hasActivity: activeDates.has(dateStr)
    })
  }
  
  return calendar
}
