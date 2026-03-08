"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SOSButtonProps {
  onActivate: () => void
  isActive: boolean
}

export function SOSButton({ onActivate, isActive }: SOSButtonProps) {
  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const HOLD_DURATION = 2000 // 2 seconds to activate

  const startHold = () => {
    if (isActive) return
    setIsHolding(true)
    setProgress(0)

    const startTime = Date.now()
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100)
      setProgress(newProgress)
    }, 16)

    holdTimerRef.current = setTimeout(() => {
      onActivate()
      setIsHolding(false)
      setProgress(0)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }, HOLD_DURATION)
  }

  const endHold = () => {
    setIsHolding(false)
    setProgress(0)
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
  }

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [])

  return (
    <div className="relative flex flex-col items-center gap-4">
      <button
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        disabled={isActive}
        className={cn(
          "relative h-44 w-44 rounded-full transition-all duration-300 select-none",
          "flex items-center justify-center",
          "shadow-[0_0_60px_rgba(239,68,68,0.3)]",
          isActive
            ? "bg-destructive animate-pulse"
            : isHolding
            ? "bg-destructive scale-95"
            : "bg-primary hover:scale-105 hover:shadow-[0_0_80px_rgba(239,68,68,0.5)]"
        )}
        aria-label="Hold for 2 seconds to activate SOS"
      >
        {/* Progress ring */}
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-foreground/20"
          />
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 48}`}
            strokeDashoffset={`${2 * Math.PI * 48 * (1 - progress / 100)}`}
            className="text-foreground transition-all duration-100"
          />
        </svg>

        <span className="text-4xl font-bold text-primary-foreground z-10">
          {isActive ? "ACTIVE" : "SOS"}
        </span>
      </button>

      <p className="text-sm text-muted-foreground text-center">
        {isActive ? "Emergency services have been alerted" : "Hold for 2 seconds to activate"}
      </p>
    </div>
  )
}
