"use client"

import { Flame } from "lucide-react"
import { WalletConnect } from "@/components/WalletConnect"
import Link from "next/link"

export function Header() {
  return (
    <header className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Flame className="h-8 w-8 text-neon-pink" />
          <h1 className="text-2xl font-bold text-white">EtherBets</h1>
        </Link>
        <div className="relative z-10">
          <WalletConnect className="text-white" />
        </div>
      </div>
    </header>
  )
} 