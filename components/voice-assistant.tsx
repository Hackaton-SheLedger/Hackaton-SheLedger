"use client";

import { useState } from "react";
import { Volume2, VolumeX, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVoice } from "@/hooks/use-voice";

const SAFETY_MESSAGES = [
  {
    id: "greeting",
    title: "Welcome Message",
    text: "Hello! I'm your SafeHer voice assistant. I'm here to help keep you safe. You can use the SOS button in case of emergency, share your location with trusted contacts, or ask me to read safety tips.",
  },
  {
    id: "emergency",
    title: "Emergency Alert",
    text: "Emergency mode activated! Your location is being shared with your trusted contacts. Stay calm and move to a safe location if possible. Help is on the way.",
  },
  {
    id: "tips",
    title: "Safety Tips",
    text: "Here are some important safety tips: Always be aware of your surroundings. Share your live location with trusted friends when traveling alone. Trust your instincts, if something feels wrong, leave the situation. Keep your phone charged and easily accessible.",
  },
  {
    id: "checkin",
    title: "Check-in Reminder",
    text: "It's time for your safety check-in. If you're safe, please confirm by tapping the check-in button. If you don't respond within 5 minutes, we'll alert your emergency contacts.",
  },
  {
    id: "location",
    title: "Location Shared",
    text: "Your live location has been shared with your trusted contacts. They can now see where you are in real-time. This sharing will automatically stop in 2 hours unless you extend it.",
  },
];

export function VoiceAssistant() {
  const { speak, stop, isSpeaking, isLoading, error } = useVoice();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const handleSpeak = (message: typeof SAFETY_MESSAGES[0]) => {
    if (isSpeaking) {
      stop();
      setSelectedMessage(null);
    } else {
      setSelectedMessage(message.id);
      speak(message.text);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="h-5 w-5 text-primary" />
          Voice Assistant
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tap any message to hear it spoken aloud
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {SAFETY_MESSAGES.map((message) => {
          const isActive = selectedMessage === message.id && (isSpeaking || isLoading);
          
          return (
            <Button
              key={message.id}
              variant="outline"
              className={`w-full justify-between h-auto py-3 px-4 ${
                isActive ? "border-primary bg-primary/10" : ""
              }`}
              onClick={() => handleSpeak(message)}
              disabled={isLoading && selectedMessage !== message.id}
            >
              <span className="text-left font-medium">{message.title}</span>
              {isActive ? (
                isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <VolumeX className="h-4 w-4 text-primary" />
                )
              ) : (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          );
        })}

        <p className="pt-2 text-center text-xs text-muted-foreground">
          Powered by ElevenLabs AI Voice
        </p>
      </CardContent>
    </Card>
  );
}
