"use client"

import { Button } from "@/components/ui/button"
import { Flame } from "lucide-react"

export function Header() {
  return (
    <header className="container mx-auto py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-8 w-8 text-neon-pink" />
          <h1 className="text-2xl font-bold text-white">EtherBets</h1>
        </div>
        <Button variant="outline" className="border-neon-pink text-white hover:bg-neon-pink/20">
          Connect Wallet
        </Button>
      </div>
    </header>
  )
} 