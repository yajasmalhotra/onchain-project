"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Users, AlertTriangle, Link as LinkIcon, Share2, Copy, Check } from "lucide-react"
import { useAccount } from "wagmi"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useContract } from "@/hooks/useContract"
import { formatEther, parseEther } from "viem"
import { useRouter } from "next/navigation"
import QRCode from "react-qr-code"

export function BetClient({ betId }: { betId: string }) {
  const { address } = useAccount()
  const router = useRouter()
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSide, setSelectedSide] = useState<1 | 2 | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  
  // Contract interactions
  const { 
    useGetBet, 
    useGetAllSide1Participants, 
    useGetAllSide2Participants, 
    useJoinBet,
    useSettleBet
  } = useContract()
  
  const { data: bet, isLoading: isLoadingBet } = useGetBet(betId)
  const { data: side1Participants } = useGetAllSide1Participants(betId)
  const { data: side2Participants } = useGetAllSide2Participants(betId)
  const { joinBet, isLoading: isJoiningBet } = useJoinBet()
  const { settleBet, isLoading: isSettlingBet } = useSettleBet()
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [settleDialogOpen, setSettleDialogOpen] = useState(false)
  const [betAmount, setBetAmount] = useState("")
  const [betError, setBetError] = useState("")
  const [winningSide, setWinningSide] = useState<1 | 2 | null>(null)
  
  // Get the full URL for sharing
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href
    }
    return ''
  }
  
  // Handle copying the link to clipboard
  const copyToClipboard = () => {
    const url = getShareUrl()
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  useEffect(() => {
    // If bet doesn't exist, there's no need to check ownership
    if (!bet) {
      setIsLoading(false)
      return
    }
    
    const checkIfOwner = async () => {
      setIsLoading(true)
      try {
        // Contract returns an array with the bet data
        const owner = bet[0] as string
        // Compare with the connected wallet address from contract data
        setIsOwner(address ? owner.toLowerCase() === address.toLowerCase() : false)
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
  }, [address, betId, bet])

  // Transform contract data into a more usable format
  const activeBet = bet ? {
    title: bet[5] as string, // title is at index 5
    creator: bet[0] as string, // owner is at index 0
    side1Title: bet[1] as string, // side1Title is at index 1
    side2Title: bet[2] as string, // side2Title is at index 2
    side1Total: formatEther(bet[3] as bigint), // side1Total is at index 3
    side2Total: formatEther(bet[4] as bigint), // side2Total is at index 4
    totalPool: formatEther((bet[3] as bigint) + (bet[4] as bigint)),
    settled: bet[6] as boolean, // settled is at index 6
    side1Participants: side1Participants?.length || 0,
    side2Participants: side2Participants?.length || 0,
    totalParticipants: (side1Participants?.length || 0) + (side2Participants?.length || 0),
    winningSide: bet[7] as 0 | 1 | 2, // Assuming winningSide is at index 7
  } : null
  
  // If bet not found, display a "Not Found" page
  if (isLoadingBet) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-8">
          <CardContent className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-pink"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!activeBet) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-center p-8">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-neon-pink/20 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-neon-pink" />
              </div>
              <CardTitle className="text-2xl text-white">Bet Not Found</CardTitle>
              <CardDescription className="text-white/70 text-lg">
                The bet with ID "{betId}" does not exist or has been removed.
              </CardDescription>
              <Link href="/" className="mt-6">
                <Button className="bg-neon-yellow text-black hover:bg-neon-yellow/90 mt-4">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
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

  const handleOpenSettleDialog = () => {
    if (!address) {
      return
    }
    
    setSettleDialogOpen(true)
  }
  
  const handleBet = async () => {
    // Validate bet amount and side selection
    if (!betAmount || parseFloat(betAmount) <= 0) {
      setBetError("Please enter a valid amount")
      return
    }
    
    if (selectedSide !== 1 && selectedSide !== 2) {
      setBetError("Please select a side to bet on")
      return
    }
    
    try {
      // Call contract to join the bet
      await joinBet({
        betId,
        side: selectedSide, 
        amount: betAmount
      })
      
      // Reset and close dialog
      setBetAmount("")
      setSelectedSide(null)
      setDialogOpen(false)
    } catch (error) {
      console.error("Error placing bet:", error)
      setBetError("Failed to place bet. Please try again.")
    }
  }

  const handleSettleBet = async () => {
    if (winningSide !== 1 && winningSide !== 2) {
      return
    }
    
    try {
      await settleBet({
        betId,
        winningSide
      })
      
      setWinningSide(null)
      setSettleDialogOpen(false)
    } catch (error) {
      console.error("Error settling bet:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-white mb-2">{activeBet.title}</CardTitle>
              <CardDescription className="text-white/70">
                Created by {activeBet.creator.substring(0, 6)}...{activeBet.creator.substring(activeBet.creator.length - 4)} • Bet ID: {betId}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10"
                  >
                    <Share2 className="h-4 w-4 mr-1" /> Share
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/90 border-white/20 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-neon-yellow">Share This Bet</DialogTitle>
                    <DialogDescription className="text-white/70">
                      Share this bet with friends or on social media
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg">
                      <QRCode
                        value={getShareUrl()}
                        size={180}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                        level="H"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={getShareUrl()}
                        className="bg-black/60 border-white/20 text-white flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10"
                        onClick={copyToClipboard}
                      >
                        {copied ? <Check className="h-4 w-4" data-testid="check-icon" /> : <Copy className="h-4 w-4" data-testid="copy-icon" />}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <div className="px-3 py-1 rounded-full bg-neon-yellow/20 text-neon-yellow text-sm font-medium">
                {activeBet.settled ? "Settled" : "Active"}
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
                  <p className="text-xl font-medium text-white">{activeBet.totalPool} ETH</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-white/70">Participants</p>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-neon-yellow" />
                  <p className="text-xl font-medium text-white">{activeBet.totalParticipants}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-white/70">Betting Sides</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-white/20 bg-white/5">
                  <div className="font-medium text-neon-yellow mb-2">{activeBet.side1Title}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Pool:</span>
                    <span className="text-white">{activeBet.side1Total} ETH</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-white/70">Participants:</span>
                    <span className="text-white">{activeBet.side1Participants}</span>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-white/20 bg-white/5">
                  <div className="font-medium text-neon-pink mb-2">{activeBet.side2Title}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Pool:</span>
                    <span className="text-white">{activeBet.side2Total} ETH</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-white/70">Participants:</span>
                    <span className="text-white">{activeBet.side2Participants}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Winning Side if Settled */}
            {activeBet.settled && activeBet.winningSide !== 0 && (
              <div className="pt-4 text-center">
                <p className="text-lg font-medium text-white">
                  Winning Side: 
                  <span className={`ml-2 font-semibold ${
                    activeBet.winningSide === 1 ? 'text-neon-yellow' : 'text-neon-pink'
                  }`}>
                    {activeBet.winningSide === 1 ? activeBet.side1Title : activeBet.side2Title}
                  </span>
                </p>
              </div>
            )}

            <div className="pt-4">
              {isLoading ? (
                <Button disabled className="w-full">
                  Loading...
                </Button>
              ) : isOwner ? (
                <div className="space-y-3">
                  {!activeBet.settled && (
                    <Button 
                      className="w-full bg-neon-yellow text-black hover:bg-neon-yellow/90"
                      onClick={handleOpenSettleDialog}
                      disabled={isSettlingBet}
                    >
                      {isSettlingBet ? "Processing..." : "Settle Bet"}
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  {betError && <p className="text-red-500 mb-2 text-sm">{betError}</p>}
                  <Button 
                    className="w-full bg-neon-pink text-white hover:bg-neon-pink/90"
                    onClick={handleOpenBetDialog}
                    disabled={isJoiningBet || activeBet.settled}
                  >
                    {isJoiningBet ? "Processing..." : activeBet.settled ? "Bet Settled" : "Enter Bet"}
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
              How much ETH would you like to bet on "{activeBet.title}"?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-white/70">
                Select a Side
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button" 
                  variant={selectedSide === 1 ? "default" : "outline"}
                  className={selectedSide === 1 ? "bg-neon-yellow text-black" : "border-neon-yellow text-neon-yellow"}
                  onClick={() => setSelectedSide(1)}
                >
                  {activeBet.side1Title}
                </Button>
                <Button 
                  type="button" 
                  variant={selectedSide === 2 ? "default" : "outline"}
                  className={selectedSide === 2 ? "bg-neon-pink text-white" : "border-neon-pink text-neon-pink"}
                  onClick={() => setSelectedSide(2)}
                >
                  {activeBet.side2Title}
                </Button>
              </div>
            </div>
            
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

      {/* Settle Bet Dialog */}
      <Dialog open={settleDialogOpen} onOpenChange={setSettleDialogOpen}>
        <DialogContent className="bg-black/90 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-neon-yellow">Settle Bet</DialogTitle>
            <DialogDescription className="text-white/70">
              Select the winning side for "{activeBet.title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-white/70">
                Select Winning Side
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button" 
                  variant={winningSide === 1 ? "default" : "outline"}
                  className={winningSide === 1 ? "bg-neon-yellow text-black" : "border-neon-yellow text-neon-yellow"}
                  onClick={() => setWinningSide(1)}
                >
                  {activeBet.side1Title}
                </Button>
                <Button 
                  type="button" 
                  variant={winningSide === 2 ? "default" : "outline"}
                  className={winningSide === 2 ? "bg-neon-pink text-white" : "border-neon-pink text-neon-pink"}
                  onClick={() => setWinningSide(2)}
                >
                  {activeBet.side2Title}
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettleDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-neon-yellow text-black hover:bg-neon-yellow/90" 
              onClick={handleSettleBet}
              disabled={winningSide !== 1 && winningSide !== 2}
            >
              Settle Bet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 