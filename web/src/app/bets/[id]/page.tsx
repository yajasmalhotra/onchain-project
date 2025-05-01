"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Users } from "lucide-react"

// Mock data - will be replaced with real data fetching
const mockBet = {
  id: "1",
  title: "ETH Price > $3,000",
  creator: "0x123...abc",
  amount: "0.5 ETH",
  participants: 12,
  endDate: "May 15, 2025",
  description: "This bet will be won if the ETH price exceeds $3,000 by the end date.",
  totalPool: "6.0 ETH",
  status: "active",
}

export default function BetPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-white mb-2">{mockBet.title}</CardTitle>
              <CardDescription className="text-white/70">
                Created by {mockBet.creator}
              </CardDescription>
            </div>
            <div className="px-3 py-1 rounded-full bg-neon-yellow/20 text-neon-yellow text-sm font-medium">
              {mockBet.status.charAt(0).toUpperCase() + mockBet.status.slice(1)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-white/70">Total Pool</p>
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-neon-yellow" />
                  <p className="text-xl font-medium text-white">{mockBet.totalPool}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-white/70">Participants</p>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-neon-yellow" />
                  <p className="text-xl font-medium text-white">{mockBet.participants}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-white/70">Description</p>
              <p className="text-white">{mockBet.description}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-white/70">End Date</p>
              <p className="text-white">{mockBet.endDate}</p>
            </div>

            <div className="pt-4">
              <Button className="w-full bg-neon-pink text-white hover:bg-neon-pink/90">
                Enter Bet
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 