"use client"

import { useState } from "react"
import { Plus, Phone, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Contact {
  id: string
  name: string
  phone: string
  relationship: string
  initials: string
}

const initialContacts: Contact[] = [
  { id: "1", name: "Mom", phone: "+1 (555) 123-4567", relationship: "Family", initials: "MO" },
  { id: "2", name: "Sarah Chen", phone: "+1 (555) 234-5678", relationship: "Friend", initials: "SC" },
  { id: "3", name: "Partner", phone: "+1 (555) 345-6789", relationship: "Partner", initials: "PA" },
]

export function TrustedContacts() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [isOpen, setIsOpen] = useState(false)
  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" })

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: Contact = {
        id: Date.now().toString(),
        name: newContact.name,
        phone: newContact.phone,
        relationship: newContact.relationship || "Friend",
        initials: newContact.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      }
      setContacts([...contacts, contact])
      setNewContact({ name: "", phone: "", relationship: "" })
      setIsOpen(false)
    }
  }

  const removeContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id))
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">Trusted Circle</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add Trusted Contact</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Add someone you trust to your emergency network.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <Input
                placeholder="Name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
              <Input
                placeholder="Phone number"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
              <Input
                placeholder="Relationship (e.g., Friend, Family)"
                value={newContact.relationship}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button onClick={addContact} className="w-full">
                Add Contact
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 group"
          >
            <Avatar className="h-10 w-10 bg-primary/20">
              <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                {contact.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{contact.name}</p>
              <p className="text-xs text-muted-foreground">{contact.relationship}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                aria-label={`Call ${contact.name}`}
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                aria-label={`Share location with ${contact.name}`}
              >
                <MapPin className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeContact(contact.id)}
                aria-label={`Remove ${contact.name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
