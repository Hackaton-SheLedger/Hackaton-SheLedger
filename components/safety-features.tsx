"use client"

import { MapPin, Phone, Users, Shield, MessageCircle, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: MapPin,
    title: "Live Location",
    description: "Share your real-time location with trusted contacts",
    action: "Share Location",
  },
  {
    icon: Phone,
    title: "Quick Dial",
    description: "One-tap access to emergency services",
    action: "Call Now",
  },
  {
    icon: Users,
    title: "Trusted Circle",
    description: "Manage your emergency contacts network",
    action: "View Contacts",
  },
  {
    icon: Shield,
    title: "Safe Walk",
    description: "Virtual companion monitors your journey",
    action: "Start Walk",
  },
  {
    icon: MessageCircle,
    title: "Silent Alert",
    description: "Discreet SOS when you can't make a call",
    action: "Send Alert",
  },
  {
    icon: Bell,
    title: "Check-in",
    description: "Set timed alerts if you don't check in",
    action: "Set Timer",
  },
]

interface SafetyFeaturesProps {
  onFeatureClick: (feature: string) => void
}

export function SafetyFeatures({ onFeatureClick }: SafetyFeaturesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {features.map((feature) => (
        <Card
          key={feature.title}
          className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group"
          onClick={() => onFeatureClick(feature.title)}
        >
          <CardHeader className="pb-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-sm font-medium text-foreground">
              {feature.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-xs text-muted-foreground leading-relaxed">
              {feature.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
