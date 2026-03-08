"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, ChevronRight } from "lucide-react"

const tips = [
  {
    id: 1,
    title: "Stay aware of your surroundings",
    description: "Keep your head up and phone away while walking. Trust your instincts.",
  },
  {
    id: 2,
    title: "Share your live location",
    description: "When traveling alone, share your journey with trusted contacts.",
  },
  {
    id: 3,
    title: "Learn basic self-defense",
    description: "Knowing simple techniques can boost your confidence and safety.",
  },
  {
    id: 4,
    title: "Plan your route in advance",
    description: "Stick to well-lit, populated areas especially at night.",
  },
]

export function SafetyTips() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-warning" />
          Safety Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{tip.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {tip.description}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
