'use client'

import { useState, useCallback, useEffect } from 'react'
import useSWR from 'swr'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LayoutDashboard, MessageCircle, Plus, BarChart3, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/sheledger/header'
import { ScoreWidget } from '@/components/sheledger/score-widget'
import { SummaryCards } from '@/components/sheledger/summary-cards'
import { FinancialCharts } from '@/components/sheledger/financial-charts'
import { ActivityTracker } from '@/components/sheledger/activity-tracker'
import { InsightsPanel } from '@/components/sheledger/insights-panel'
import { ChatAssistant } from '@/components/sheledger/chat-assistant'
import { RecordForm } from '@/components/sheledger/record-form'
import { Onboarding } from '@/components/sheledger/onboarding'
import { WhatsAppConnect } from '@/components/sheledger/whatsapp-connect'
import { DailySummaryPlayer, MotivationalAlert, VoiceAssistantBadge } from '@/components/sheledger/voice-features'
import { type ParsedFinancialData } from '@/lib/mock-data'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function SheLedgerDashboard() {
  const [activeTab, setActiveTab] = useState('chat')
  const [recordCount, setRecordCount] = useState(0)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Fetch real data from API with auto-refresh every 5 seconds
  const { data, error, isLoading, mutate } = useSWR('/api/records', fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('sheledger_onboarding')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem('sheledger_onboarding', 'true')
    setShowOnboarding(false)
  }

  // Use API data or defaults
  const summary = data?.summary || {
    totalSales: 0,
    totalExpenses: 0,
    totalSavings: 0,
    netProfit: 0,
    expenseRatio: 0,
    totalRecords: 0
  }

  const score = data?.score || 50

  // Format weekly data for charts
  const weeklyData = (data?.weeklyData || []).map((d: { date: string; sales: number; expenses: number }) => ({
    day: new Date(d.date).toLocaleDateString('es', { weekday: 'short' }),
    sales: Number(d.sales),
    expenses: Number(d.expenses),
    profit: Number(d.sales) - Number(d.expenses)
  }))

  // Generate expense breakdown from summary
  const expenseBreakdown = [
    { name: 'Gastos', value: summary.totalExpenses, fill: 'var(--chart-1)' },
    { name: 'Ahorros', value: summary.totalSavings, fill: 'var(--chart-2)' },
    { name: 'Ganancia', value: Math.max(0, summary.netProfit), fill: 'var(--chart-4)' },
  ]

  // Generate profit trend from records
  const profitTrend = (data?.records || []).slice(0, 14).map((r: { sales: number; expenses: number }, i: number) => ({
    day: i + 1,
    profit: Number(r.sales) - Number(r.expenses),
    sales: Number(r.sales)
  })).reverse()

  // Generate activity calendar
  const activityCalendar = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const hasActivity = (data?.records || []).some((r: { created_at: string }) => 
      new Date(r.created_at).toDateString() === date.toDateString()
    )
    return { date, hasActivity }
  })

  // Generate insights
  const insights: string[] = []
  if (summary.totalRecords > 0) {
    if (summary.expenseRatio < 50) {
      insights.push('Tus gastos estan bien controlados esta semana.')
    } else if (summary.expenseRatio > 70) {
      insights.push(`Tus gastos representan el ${summary.expenseRatio}% de tus ventas. Considera reducir costos.`)
    }
    if (summary.totalSavings > 0) {
      const savingsRate = Math.round((summary.totalSavings / Math.max(summary.totalSales, 1)) * 100)
      insights.push(`Ahorraste el ${savingsRate}% de tus ingresos.`)
    }
    if (summary.netProfit > 0) {
      insights.push(`Tu ganancia neta esta semana es S/ ${summary.netProfit}.`)
    }
  } else {
    insights.push('Comienza a registrar tus ventas para ver consejos personalizados.')
  }

  const handleRecordAdded = useCallback((d: ParsedFinancialData) => {
    setRecordCount((prev) => prev + 1)
    mutate() // Refresh data
    console.log('Nuevo registro agregado:', d)
  }, [mutate])

  const handleFormSubmit = useCallback(
    () => {
      // Record was already saved by the form component
      // Just refresh the data
      setRecordCount((prev) => prev + 1)
      mutate() // Refresh data
    },
    [mutate]
  )

  const handleRefresh = () => {
    mutate()
  }

  return (
    <>
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      
      <div className="min-h-screen bg-background">
        <Header userName="Emprendedora" businessType="negocio" />

        <main className="container mx-auto px-4 pb-24 pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Chat Tab */}
            <TabsContent value="chat" className="mt-0">
              <div className="mx-auto max-w-2xl">
                <div className="mb-4 flex justify-center">
                  <VoiceAssistantBadge />
                </div>
                <ChatAssistant onRecordAdded={handleRecordAdded} score={score} summary={summary} />
                {recordCount > 0 && (
                  <p className="mt-4 text-center text-sm text-safe">
                    {recordCount} registro{recordCount > 1 ? 's' : ''} agregado{recordCount > 1 ? 's' : ''} en esta sesion
                  </p>
                )}
                
                <div className="mt-6">
                  <WhatsAppConnect />
                </div>
              </div>
            </TabsContent>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="mt-0 space-y-6">
              {/* Refresh button */}
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">
                  Error al cargar datos. Intenta de nuevo.
                </div>
              )}

              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="flex flex-col gap-6 lg:w-72 lg:shrink-0">
                  <ScoreWidget score={score} />
                  <DailySummaryPlayer summary={summary} score={score} />
                  <MotivationalAlert summary={summary} score={score} />
                  <InsightsPanel insights={insights} />
                </div>

                <div className="flex-1 space-y-6">
                  <SummaryCards
                    totalSales={summary.totalSales}
                    totalExpenses={summary.totalExpenses}
                    netProfit={summary.netProfit}
                    totalSavings={summary.totalSavings}
                  />

                  {weeklyData.length > 0 && (
                    <FinancialCharts
                      weeklyData={weeklyData}
                      expenseBreakdown={expenseBreakdown}
                      profitTrend={profitTrend}
                    />
                  )}

                  <div className="grid gap-6 lg:grid-cols-2">
                    <ActivityTracker calendar={activityCalendar} />
                    <RecordForm onSubmit={handleFormSubmit} />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Record Tab */}
            <TabsContent value="record" className="mt-0">
              <div className="mx-auto max-w-md">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    Registrar Actividad
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Ingresa manualmente tu actividad financiera diaria
                  </p>
                </div>
                <RecordForm onSubmit={handleFormSubmit} />

                <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 p-4">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    Consejo
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tambien puedes registrar tus ventas por WhatsApp. 
                    Solo envia &quot;Vendi 100 soles&quot; y se registrara automaticamente.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-0 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Analisis Financiero
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Vista detallada de tu rendimiento financiero
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">Ratio de Gastos</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">
                    {summary.expenseRatio}%
                  </p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min(summary.expenseRatio, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">Tasa de Ahorro</p>
                  <p className="mt-1 text-3xl font-bold text-safe">
                    {summary.totalSales > 0 ? Math.round((summary.totalSavings / summary.totalSales) * 100) : 0}%
                  </p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-safe rounded-full transition-all"
                      style={{ width: `${summary.totalSales > 0 ? Math.min(Math.round((summary.totalSavings / summary.totalSales) * 100), 100) : 0}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">Margen de Ganancia</p>
                  <p className="mt-1 text-3xl font-bold text-primary">
                    {summary.totalSales > 0 ? Math.round((summary.netProfit / summary.totalSales) * 100) : 0}%
                  </p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${summary.totalSales > 0 ? Math.min(Math.round((summary.netProfit / summary.totalSales) * 100), 100) : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {weeklyData.length > 0 && (
                <FinancialCharts
                  weeklyData={weeklyData}
                  expenseBreakdown={expenseBreakdown}
                  profitTrend={profitTrend}
                />
              )}

              <div className="grid gap-6 lg:grid-cols-2">
                <ActivityTracker calendar={activityCalendar} />
                <InsightsPanel insights={insights} />
              </div>
            </TabsContent>

            {/* Bottom Navigation */}
            <TabsList className="fixed bottom-0 left-0 right-0 z-50 grid h-16 grid-cols-4 rounded-none border-t border-border bg-card/95 px-2 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <TabsTrigger
                value="chat"
                className="flex flex-col gap-1 text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-xs">Asistente</span>
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="flex flex-col gap-1 text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="text-xs">Panel</span>
              </TabsTrigger>
              <TabsTrigger
                value="record"
                className="flex flex-col gap-1 text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary"
              >
                <Plus className="h-5 w-5" />
                <span className="text-xs">Registrar</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex flex-col gap-1 text-muted-foreground data-[state=active]:bg-transparent data-[state=active]:text-primary"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-xs">Analisis</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </main>
      </div>
    </>
  )
}
