"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Coins, Plus, Sparkles, Trophy, User, Users } from "lucide-react"
import { useAccount } from 'wagmi'

// Mock data for demonstration - Bets created by the user
const mockOwnedBets = [
  {
    id: "1",
    title: "ETH Price > $3,000",
    amount: "0.5 ETH",
    odds: "2.5x",
    status: "active",
    endDate: "May 15, 2025",
    potentialWinnings: "1.25 ETH",
    isOwner: true,
    participants: 5,
  },
  {
    id: "2",
    title: "BTC/ETH Ratio < 15",
    amount: "0.2 ETH",
    odds: "3.2x",
    status: "won",
    endDate: "April 28, 2025",
    potentialWinnings: "0.64 ETH",
    isOwner: true,
    participants: 8,
  },
]

// Mock data for demonstration - Bets the user has participated in
const mockParticipatedBets = [
  {
    id: "3",
    title: "Total ETH Staked > 30M",
    amount: "0.1 ETH",
    odds: "4.0x",
    status: "lost",
    endDate: "April 20, 2025",
    potentialWinnings: "0.4 ETH",
    isOwner: false,
    creator: "0x7890...abcd",
  },
  {
    id: "4",
    title: "SOL Price < $150",
    amount: "0.15 ETH",
    odds: "2.8x",
    status: "active",
    endDate: "June 10, 2025",
    potentialWinnings: "0.42 ETH",
    isOwner: false,
    creator: "0x3456...ef12",
  },
]

export default function HomePage() {
  const [open, setOpen] = useState(false)
  const [betName, setBetName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const { address, isConnected } = useAccount()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      console.log("Bet Name:", betName)
      console.log("Wallet Address:", address)
      
      // Show confirmation
      alert("Bet created successfully!")
      setOpen(false)
      setBetName("")
    } catch (error) {
      console.error("Error creating bet:", error)
      alert("Failed to create bet. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter bets based on active tab
  const getFilteredOwnedBets = () => {
    if (activeTab === "all") return mockOwnedBets
    return mockOwnedBets.filter(bet => 
      (activeTab === "active" && bet.status === "active") || 
      (activeTab === "completed" && (bet.status === "won" || bet.status === "lost"))
    )
  }

  const getFilteredParticipatedBets = () => {
    if (activeTab === "all") return mockParticipatedBets
    return mockParticipatedBets.filter(bet => 
      (activeTab === "active" && bet.status === "active") || 
      (activeTab === "completed" && (bet.status === "won" || bet.status === "lost"))
    )
  }

  // Render a single bet card
  const renderBetCard = (bet: any) => (
    <Card key={bet.id} className="bg-white/10 border-white/20 backdrop-blur-sm overflow-hidden">
      <div
        className={`h-1 w-full ${
          bet.status === "active"
            ? "bg-neon-yellow"
            : bet.status === "won"
              ? "bg-neon-green"
              : "bg-neon-pink"
        }`}
      />
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">{bet.title}</CardTitle>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              bet.status === "active"
                ? "bg-neon-yellow/20 text-neon-yellow"
                : bet.status === "won"
                  ? "bg-neon-green/20 text-neon-green"
                  : "bg-neon-pink/20 text-neon-pink"
            }`}
          >
            {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
          </div>
        </div>
        <CardDescription className="text-white/70">
          {bet.isOwner && bet.participants ? 
            `${bet.participants} participants • Ends ${bet.endDate}` : 
            `Created by ${bet.creator} • Ends ${bet.endDate}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-white/70">Your Stake</p>
            <p className="text-lg font-medium text-white">{bet.amount}</p>
          </div>
          <div>
            <p className="text-sm text-white/70">Odds</p>
            <p className="text-lg font-medium text-white">{bet.odds}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-white/10 bg-white/5">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <Coins className="h-4 w-4 text-neon-yellow" />
            <span className="text-sm text-white/70">Potential Win:</span>
          </div>
          <span className="font-medium text-white">{bet.potentialWinnings}</span>
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <>
      <section className="mb-12 text-center">
        <div className="mx-auto max-w-3xl space-y-4 py-12">
          <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
            <Sparkles className="mr-1 h-4 w-4 text-neon-yellow" />
            <span>Decentralized Betting on Ethereum</span>
          </div>
          <h2 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Bet on Anything. <span className="text-neon-pink">Win Big.</span>
          </h2>
          <p className="text-xl text-white/80">
            Create custom bets on crypto markets, events, and more with our decentralized betting platform.
          </p>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="mt-6 bg-neon-pink text-white hover:bg-neon-pink/90">
                <Plus className="mr-2 h-5 w-5" /> Create a New Bet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-cyber-blue border-neon-pink">
              <DialogHeader>
                <DialogTitle className="text-white">Create a New Bet</DialogTitle>
                <DialogDescription className="text-white/70">
                  Create a new bet for others to participate in.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bet-name" className="text-white">
                      Bet Name
                    </Label>
                    <Input
                      id="bet-name"
                      placeholder="e.g., ETH Price > $3,000 by June"
                      className="bg-white/10 text-white border-white/20"
                      value={betName}
                      onChange={(e) => setBetName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="bg-neon-pink text-white hover:bg-neon-pink/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Bet"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-2xl font-bold text-white">Your Bets</h3>
          <Tabs 
            defaultValue="all" 
            className="w-full sm:w-auto" 
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="bg-white/10 text-white w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-1 sm:flex-none data-[state=active]:bg-neon-pink">
                All
              </TabsTrigger>
              <TabsTrigger value="active" className="flex-1 sm:flex-none data-[state=active]:bg-neon-pink">
                Active
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1 sm:flex-none data-[state=active]:bg-neon-pink">
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isConnected ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bets you created */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-neon-pink" />
                <h4 className="text-xl font-semibold text-white">Bets You Created</h4>
              </div>
              
              {getFilteredOwnedBets().length > 0 ? (
                <div className="grid gap-4">
                  {getFilteredOwnedBets().map(bet => renderBetCard(bet))}
                </div>
              ) : (
                <Card className="bg-white/10 border-white/20 p-6 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                    <User className="h-5 w-5 text-neon-yellow" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-white">No owned bets</h3>
                  <p className="mt-1 text-sm text-white/70">Create your first bet to get started!</p>
                  <Button onClick={() => setOpen(true)} className="mt-3 bg-neon-pink text-white hover:bg-neon-pink/90 text-sm py-1">
                    <Plus className="mr-1 h-4 w-4" /> Create a Bet
                  </Button>
                </Card>
              )}
            </div>

            {/* Bets you participated in */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-neon-green" />
                <h4 className="text-xl font-semibold text-white">Bets You Joined</h4>
              </div>
              
              {getFilteredParticipatedBets().length > 0 ? (
                <div className="grid gap-4">
                  {getFilteredParticipatedBets().map(bet => renderBetCard(bet))}
                </div>
              ) : (
                <Card className="bg-white/10 border-white/20 p-6 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                    <Users className="h-5 w-5 text-neon-yellow" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-white">No joined bets</h3>
                  <p className="mt-1 text-sm text-white/70">Explore available bets to participate!</p>
                  <Button className="mt-3 bg-neon-green text-white hover:bg-neon-green/90 text-sm py-1">
                    Explore Bets
                  </Button>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <Card className="bg-white/10 border-white/20 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
              <Trophy className="h-6 w-6 text-neon-yellow" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-white">Connect Your Wallet</h3>
            <p className="mt-2 text-white/70">Connect your wallet to see your bets and create new ones.</p>
          </Card>
        )}
      </section>
    </>
  )
}