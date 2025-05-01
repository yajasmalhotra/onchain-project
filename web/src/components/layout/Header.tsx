"use client"

import { Flame } from "lucide-react"
import { WalletConnect } from "@/components/WalletConnect"

export function Header() {
  return (
    <header className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-8 w-8 text-neon-pink" />
          <h1 className="text-2xl font-bold text-white">EtherBets</h1>
        </div>
        <div className="relative z-10">
          <WalletConnect className="text-white" />
        </div>
      </div>
    </header>
  )
} 