// Parser utilities for SheLedger - NO MOCK DATA

export interface ParsedFinancialData {
  sales?: number
  expenses?: number
  savings?: number
}

// Parse financial messages from chat or WhatsApp
export const parseFinancialMessage = (message: string): ParsedFinancialData | null => {
  const result: ParsedFinancialData = {}

  // Match patterns like "vendi 120", "gaste 40", "ahorre 20"
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
