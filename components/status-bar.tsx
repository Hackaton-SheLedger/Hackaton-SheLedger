"use client"

import { Shield, Wifi, Battery } from "lucide-react"

interface StatusBarProps {
  isActive: boolean
}

export function StatusBar({ isActive }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-secondary/50 rounded-xl">
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${
            isActive ? "bg-destructive animate-pulse" : "bg-safe"
          }`}
        />
        <span className="text-sm font-medium text-foreground">
          {isActive ? "Emergency Mode Active" : "Protected"}
        </span>
      </div>
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="flex items-center gap-1">
          <Shield className="h-4 w-4" />
          <span className="text-xs">Secure</span>
        </div>
        <div className="flex items-center gap-1">
          <Wifi className="h-4 w-4" />
          <span className="text-xs">Online</span>
        </div>
        <div className="flex items-center gap-1">
          <Battery className="h-4 w-4" />
          <span className="text-xs">85%</span>
        </div>
      </div>
    </div>
  )
}
