"use client"

import { X, MapPin, Phone, MessageCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EmergencyModalProps {
  isOpen: boolean
  onClose: () => void
  onCancel: () => void
}

export function EmergencyModal({ isOpen, onClose, onCancel }: EmergencyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-destructive/50 max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center animate-pulse">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <DialogTitle className="text-xl text-foreground">Emergency Mode Active</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Your trusted contacts have been alerted with your location.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <div className="h-10 w-10 rounded-full bg-safe/20 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-safe" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Location Shared</p>
              <p className="text-xs text-muted-foreground">
                Real-time location sent to 3 contacts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Alert Sent</p>
              <p className="text-xs text-muted-foreground">
                SMS alerts delivered to your circle
              </p>
            </div>
          </div>

          <a
            href="tel:911"
            className="flex items-center gap-3 p-3 rounded-lg bg-destructive/20 hover:bg-destructive/30 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-destructive/30 flex items-center justify-center">
              <Phone className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Call Emergency Services</p>
              <p className="text-xs text-muted-foreground">Tap to dial 911</p>
            </div>
          </a>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-secondary"
            onClick={onCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel Alert
          </Button>
          <Button
            className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onClose}
          >
            Keep Active
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
