"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Users } from "lucide-react"
import { useAccount } from "wagmi"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

// Mock data - will be replaced with real data fetching
const mockBets = {
  "1": {
    id: "1",
    title: "ETH Price > $3,000",
    creator: "0xC5fD32E7E839783d8BDB2A2441C2e4B56a3aa564", // Hardcoded owner address
    amount: "0.5 ETH",
    participants: 12,
    endDate: "May 15, 2025",
    description: "This bet will be won if the ETH price exceeds $3,000 by the end date.",
    totalPool: "6.0 ETH",
    status: "active",
  },
  "2": {
    id: "2",
    title: "BTC Price < $50,000",
    creator: "0xA2b4C6D8E0F1G2h3I4j5K6l7M8n9O0p1Q2r3S4t5", // Random owner address
    amount: "0.8 ETH",
    participants: 8,
    endDate: "June 20, 2025",
    description: "This bet will be won if the BTC price falls below $50,000 by the end date.",
    totalPool: "6.4 ETH",
    status: "active",
  },
  "3": {
    id: "3",
    title: "SOL Price > $150",
    creator: "0x7890abcDEF1234567890ABCdef123456789abCDEF", // Random owner address
    amount: "0.3 ETH",
    participants: 5,
    endDate: "July 10, 2025",
    description: "This bet will be won if SOL price exceeds $150 by the end date.",
    totalPool: "1.5 ETH",
    status: "active",
  },
  "4": {
    id: "4",
    title: "DOGE Reaches Top 3 by Market Cap",
    creator: "0x0123456789abcdef0123456789AbCdEf01234567", // Random owner address
    amount: "1.0 ETH",
    participants: 20,
    endDate: "December 31, 2025",
    description: "This bet will be won if Dogecoin becomes one of the top 3 cryptocurrencies by market cap.",
    totalPool: "20.0 ETH",
    status: "active",
  }
}

export function BetClient({ betId }: { betId: string }) {
  const { address } = useAccount()
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const bet = mockBets[betId as keyof typeof mockBets] || mockBets["1"]
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [betAmount, setBetAmount] = useState("")
  const [betError, setBetError] = useState("")
  
  useEffect(() => {
    const checkIfOwner = async () => {
      setIsLoading(true)
      try {
        // Direct comparison with the connected wallet address
        const isCreator = address && bet.creator.toLowerCase() === address.toLowerCase()
        setIsOwner(isCreator || false)
      } catch (error) {
        console.error("Failed to check bet ownership:", error)
        setIsOwner(false)
      } finally {
        setIsLoading(false)
      }
    }

    if (address) {
      checkIfOwner()
    } else {
      setIsOwner(false)
      setIsLoading(false)
    }
  }, [address, betId, bet.creator])
  
  const handleOpenBetDialog = () => {
    if (!address) {
      // Display error if wallet not connected
      setBetError("Please connect your wallet first")
      return
    }
    
    // Clear previous error and open dialog
    setBetError("")
    setDialogOpen(true)
  }
  
  const handleBet = async () => {
    // Validate bet amount
    if (!betAmount || parseFloat(betAmount) <= 0) {
      setBetError("Please enter a valid amount")
      return
    }
    
    try {
      // Here you would call your contract to place the bet
      console.log(`Placing bet of ${betAmount} ETH on bet ID ${betId}`)
      
      // In a real implementation, you would:
      // 1. Create a contract instance
      // 2. Call the bet function with the amount
      // 3. Handle transaction completion
      
      // Mock successful transaction
      alert(`Successfully placed bet of ${betAmount} ETH!`)
      
      // Reset and close dialog
      setBetAmount("")
      setDialogOpen(false)
    } catch (error) {
      console.error("Error placing bet:", error)
      setBetError("Failed to place bet. Please try again.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-white mb-2">{bet.title}</CardTitle>
              <CardDescription className="text-white/70">
                Created by {bet.creator.substring(0, 6)}...{bet.creator.substring(bet.creator.length - 4)} • Bet ID: {betId}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-neon-yellow/20 text-neon-yellow text-sm font-medium">
                {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
              </div>
              {isOwner && (
                <div className="px-3 py-1 rounded-full bg-neon-pink/20 text-neon-pink text-sm font-medium">
                  Owner
                </div>
              )}
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
                  <p className="text-xl font-medium text-white">{bet.totalPool}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-white/70">Participants</p>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-neon-yellow" />
                  <p className="text-xl font-medium text-white">{bet.participants}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-white/70">Description</p>
              <p className="text-white">{bet.description}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-white/70">End Date</p>
              <p className="text-white">{bet.endDate}</p>
            </div>

            <div className="pt-4">
              {isLoading ? (
                <Button disabled className="w-full">
                  Loading...
                </Button>
              ) : isOwner ? (
                <div className="space-y-3">
                  <Button className="w-full bg-neon-yellow text-black hover:bg-neon-yellow/90">
                    Manage Bet
                  </Button>
                  <Button variant="outline" className="w-full border-neon-pink text-neon-pink hover:bg-neon-pink/10">
                    Cancel Bet
                  </Button>
                </div>
              ) : (
                <div>
                  {betError && <p className="text-red-500 mb-2 text-sm">{betError}</p>}
                  <Button 
                    className="w-full bg-neon-pink text-white hover:bg-neon-pink/90"
                    onClick={handleOpenBetDialog}
                  >
                    Enter Bet
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Bet Entry Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-black/90 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-neon-pink">Enter Bet</DialogTitle>
            <DialogDescription className="text-white/70">
              How much ETH would you like to bet on "{bet.title}"?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="betAmount" className="text-sm text-white/70">
                Amount (ETH)
              </label>
              <Input
                id="betAmount"
                type="number"
                min="0.001"
                step="0.001"
                placeholder="0.1"
                className="bg-black/60 border-white/20 text-white"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
              />
              {betError && <p className="text-red-500 text-sm">{betError}</p>}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-neon-pink text-white hover:bg-neon-pink/90" onClick={handleBet}>
              Place Bet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 