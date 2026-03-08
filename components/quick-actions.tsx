"use client"

import { Phone, MapPin, Video, Flashlight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function QuickActions() {
  const [flashlightOn, setFlashlightOn] = useState(false)

  const actions = [
    {
      icon: Phone,
      label: "Call 911",
      color: "bg-destructive/20 text-destructive hover:bg-destructive/30",
      onClick: () => window.open("tel:911"),
    },
    {
      icon: MapPin,
      label: "Share",
      color: "bg-safe/20 text-safe hover:bg-safe/30",
      onClick: () => {},
    },
    {
      icon: Video,
      label: "Record",
      color: "bg-primary/20 text-primary hover:bg-primary/30",
      onClick: () => {},
    },
    {
      icon: Flashlight,
      label: flashlightOn ? "On" : "Light",
      color: flashlightOn
        ? "bg-warning text-warning-foreground hover:bg-warning/90"
        : "bg-warning/20 text-warning hover:bg-warning/30",
      onClick: () => setFlashlightOn(!flashlightOn),
    },
  ]

  return (
    <div className="flex items-center justify-center gap-6">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className="flex flex-col items-center gap-1.5 group"
        >
          <div
            className={`h-14 w-14 rounded-full flex items-center justify-center transition-all ${action.color}`}
          >
            <action.icon className="h-6 w-6" />
          </div>
          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  )
}
