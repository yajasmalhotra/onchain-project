"use client"

import { useEffect, useMemo, useState } from "react"
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
import { useAccount, useReadContracts } from 'wagmi'
import { useContract, CONTRACT_ADDRESS, CONTRACT_ABI } from "@/hooks/useContract"
import { formatEther } from "viem"
import Link from "next/link"

// Define bet interface for typechecking
interface BetData {
  id: string
  title: string
  creator: string
  side1Title: string
  side2Title: string
  side1Total: string
  side2Total: string
  totalPool: string
  settled: boolean
  side1Participants: number
  side2Participants: number
  totalParticipants: number
  yourSide?: 1 | 2
  yourAmount?: string
}

export default function HomePage() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [side1Title, setSide1Title] = useState("")
  const [side2Title, setSide2Title] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [ownedBets, setOwnedBets] = useState<BetData[]>([])
  const [participatedBets, setParticipatedBets] = useState<BetData[]>([])
  const [isLoadingOwned, setIsLoadingOwned] = useState(true)
  const [isLoadingParticipated, setIsLoadingParticipated] = useState(true)
  const { address, isConnected } = useAccount()

  // Get hooks from useContract
  const contractHooks = useContract()

  // Fetch bet IDs using the hooks
  const { data: ownedBetIdsResult } = contractHooks.useGetOwnerBetIds(address || "0x0")
  const { data: participatedBetIdsResult } = contractHooks.useGetParticipantBetIds(address || "0x0")
  const { createBet, isLoading: isCreatingBet } = contractHooks.useCreateBet()

  // Memoize IDs to prevent re-renders
  const ownedBetIds = useMemo(() => ownedBetIdsResult || [], [ownedBetIdsResult])
  const participatedBetIds = useMemo(() => participatedBetIdsResult || [], [participatedBetIdsResult])

  // Prepare configurations for useReadContracts
  const allBetConfigs = useMemo(() => {
    const configs: any[] = []
    const allUniqueBetIds = Array.from(new Set([...ownedBetIds, ...participatedBetIds]))

    allUniqueBetIds.forEach(betId => {
      const id = BigInt(betId)
      // Config for fetching bet details
      configs.push({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'bets',
        args: [id],
      })
      // Config for fetching side 1 participants
      configs.push({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getAllSide1ParticipantsForBet',
        args: [id],
      })
      // Config for fetching side 2 participants
      configs.push({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getAllSide2ParticipantsForBet',
        args: [id],
      })
    })
    return configs
  }, [ownedBetIds, participatedBetIds, CONTRACT_ADDRESS, CONTRACT_ABI])

  // Fetch all data using useReadContracts
  const { data: allBetsData, isLoading: isLoadingBetsData, refetch: refetchBets } = useReadContracts({
    contracts: allBetConfigs,
    allowFailure: true, // Allow individual calls to fail without stopping others
  })

  // Process fetched data in useEffect
  useEffect(() => {
    if (!allBetsData || isLoadingBetsData || !address) {
      setIsLoadingOwned(true)
      setIsLoadingParticipated(true)
      return
    }

    const uniqueOwnedIds = new Set(ownedBetIds.map((id: bigint) => id.toString()))
    const uniqueParticipatedIds = new Set(participatedBetIds.map((id: bigint) => id.toString()))
    const allUniqueBetIds = Array.from(new Set([...ownedBetIds, ...participatedBetIds]))

    const processedOwnedBets: BetData[] = []
    const processedParticipatedBets: BetData[] = []

    try {
      for (let i = 0; i < allUniqueBetIds.length; i++) {
        const betId = allUniqueBetIds[i]
        const idStr = betId.toString()
        const dataIndex = i * 3 // Each bet has 3 associated data points (bet, side1, side2)

        const betResult = allBetsData[dataIndex]
        const side1ParticipantsResult = allBetsData[dataIndex + 1]
        const side2ParticipantsResult = allBetsData[dataIndex + 2]

        // Check for errors or missing data for this bet
        if (betResult?.status !== 'success' || !betResult.result) continue

        const betDataRaw = betResult.result as any
        const side1Participants = (side1ParticipantsResult?.status === 'success' ? side1ParticipantsResult.result : []) as ReadonlyArray<{_address: string, amount: bigint}> ?? []
        const side2Participants = (side2ParticipantsResult?.status === 'success' ? side2ParticipantsResult.result : []) as ReadonlyArray<{_address: string, amount: bigint}> ?? []

        const betFormatted: Omit<BetData, 'id' | 'yourSide' | 'yourAmount'> = {
          title: betDataRaw[5] as string,
          creator: betDataRaw[0] as string,
          side1Title: betDataRaw[1] as string,
          side2Title: betDataRaw[2] as string,
          side1Total: formatEther(betDataRaw[3] as bigint),
          side2Total: formatEther(betDataRaw[4] as bigint),
          totalPool: formatEther((betDataRaw[3] as bigint) + (betDataRaw[4] as bigint)),
          settled: betDataRaw[6] as boolean,
          side1Participants: side1Participants.length,
          side2Participants: side2Participants.length,
          totalParticipants: side1Participants.length + side2Participants.length,
        }

        // Determine if it's an owned bet
        if (uniqueOwnedIds.has(idStr)) {
          processedOwnedBets.push({ id: idStr, ...betFormatted })
        }

        // Determine if it's a participated bet and find user's side/amount
        if (uniqueParticipatedIds.has(idStr)) {
          let yourSide: 1 | 2 | undefined
          let yourAmount = "0"

          const side1Part = side1Participants.find((p: { _address: string, amount: bigint }) =>
            (p._address as string).toLowerCase() === address.toLowerCase()
          )

          const side2Part = side2Participants.find((p: { _address: string, amount: bigint }) =>
            (p._address as string).toLowerCase() === address.toLowerCase()
          )

          if (side1Part) {
            yourSide = 1
            yourAmount = formatEther(side1Part.amount as bigint)
          } else if (side2Part) {
            yourSide = 2
            yourAmount = formatEther(side2Part.amount as bigint)
          }
          processedParticipatedBets.push({ id: idStr, ...betFormatted, yourSide, yourAmount })
        }
      }

      setOwnedBets(processedOwnedBets)
      setParticipatedBets(processedParticipatedBets)

    } catch (error) {
      console.error("Error processing bet data:", error)
      setOwnedBets([])
      setParticipatedBets([])
    } finally {
      setIsLoadingOwned(false)
      setIsLoadingParticipated(false)
    }

  }, [allBetsData, ownedBetIds, participatedBetIds, address, isLoadingBetsData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !side1Title || !side2Title) {
      alert("Please fill in all fields")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await createBet({
        title,
        side1Title,
        side2Title,
      })
      
      // Reset form and close dialog
      setTitle("")
      setSide1Title("")
      setSide2Title("")
      setOpen(false)
    } catch (error) {
      console.error("Error creating bet:", error)
      alert("Failed to create bet. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter bets based on active tab
  const getFilteredOwnedBets = () => {
    if (activeTab === "all") return ownedBets
    return ownedBets.filter(bet => 
      (activeTab === "active" && !bet.settled) || 
      (activeTab === "completed" && bet.settled)
    )
  }

  const getFilteredParticipatedBets = () => {
    if (activeTab === "all") return participatedBets
    return participatedBets.filter(bet => 
      (activeTab === "active" && !bet.settled) || 
      (activeTab === "completed" && bet.settled)
    )
  }

  // Render a single bet card
  const renderBetCard = (bet: BetData) => (
    <Link href={`/bets/${bet.id}`} key={bet.id}>
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm overflow-hidden hover:bg-white/20 transition-colors cursor-pointer">
        <div
          className={`h-1 w-full ${
            !bet.settled ? "bg-neon-yellow" : "bg-neon-green"
          }`}
        />
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">{bet.title}</CardTitle>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                !bet.settled
                  ? "bg-neon-yellow/20 text-neon-yellow"
                  : "bg-neon-green/20 text-neon-green"
              }`}
            >
              {bet.settled ? "Settled" : "Active"}
            </div>
          </div>
          <CardDescription className="text-white/70">
            {bet.creator.substring(0, 6)}...{bet.creator.substring(bet.creator.length - 4)} • 
            {bet.totalParticipants} participant{bet.totalParticipants !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="p-3 bg-white/5 rounded-md">
              <p className="text-sm text-white/70">{bet.side1Title}</p>
              <p className="text-lg font-medium text-neon-yellow">{bet.side1Total} ETH</p>
            </div>
            <div className="p-3 bg-white/5 rounded-md">
              <p className="text-sm text-white/70">{bet.side2Title}</p>
              <p className="text-lg font-medium text-neon-pink">{bet.side2Total} ETH</p>
            </div>
          </div>
          
          {bet.yourSide && (
            <div className="mt-2 p-2 bg-white/5 rounded-md border border-white/10">
              <p className="text-sm text-white/70">
                Your stake: {bet.yourAmount} ETH on {bet.yourSide === 1 ? bet.side1Title : bet.side2Title}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-white/10 bg-white/5">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1">
              <Coins className="h-4 w-4 text-neon-yellow" />
              <span className="text-sm text-white/70">Total Pool:</span>
            </div>
            <span className="font-medium text-white">{bet.totalPool} ETH</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )

  const renderLoadingCard = () => (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm overflow-hidden animate-pulse">
      <div className="h-1 w-full bg-white/20" />
      <CardHeader>
        <div className="h-6 bg-white/20 rounded mb-2 w-2/3"></div>
        <div className="h-4 bg-white/20 rounded w-1/2"></div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-white/10 rounded"></div>
          <div className="h-12 bg-white/10 rounded"></div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-white/10">
        <div className="h-5 bg-white/20 rounded w-full"></div>
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
            <DialogContent className="sm:max-w-[425px] bg-black/90 border-white/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-neon-pink">Create a New Bet</DialogTitle>
                <DialogDescription className="text-white/70">
                  Create a new bet for others to participate in.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="text-white">
                      Bet Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., ETH Price Prediction"
                      className="bg-black/60 border-white/20 text-white"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="side1" className="text-white">
                      Side 1 Title
                    </Label>
                    <Input
                      id="side1"
                      placeholder="e.g., Price will exceed $3,000"
                      className="bg-black/60 border-white/20 text-white"
                      value={side1Title}
                      onChange={(e) => setSide1Title(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="side2" className="text-white">
                      Side 2 Title
                    </Label>
                    <Input
                      id="side2"
                      placeholder="e.g., Price will stay below $3,000"
                      className="bg-black/60 border-white/20 text-white"
                      value={side2Title}
                      onChange={(e) => setSide2Title(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="bg-neon-pink text-white hover:bg-neon-pink/90"
                    disabled={isSubmitting || isCreatingBet}
                  >
                    {isSubmitting || isCreatingBet ? "Creating..." : "Create Bet"} <ArrowRight className="ml-2 h-4 w-4" />
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
          <Button onClick={() => refetchBets()} disabled={isLoadingBetsData} size="sm" variant="outline">Refetch</Button>
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
              
              {isLoadingOwned || isLoadingBetsData ? (
                <div className="grid gap-4">
                  {[1, 2].map(i => <div key={i}>{renderLoadingCard()}</div>)}
                </div>
              ) : getFilteredOwnedBets().length > 0 ? (
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
              
              {isLoadingParticipated || isLoadingBetsData ? (
                <div className="grid gap-4">
                  {[1, 2].map(i => <div key={i}>{renderLoadingCard()}</div>)}
                </div>
              ) : getFilteredParticipatedBets().length > 0 ? (
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
                  <Link href="/bets">
                    <Button className="mt-3 bg-neon-green text-white hover:bg-neon-green/90 text-sm py-1">
                      Explore Bets
                    </Button>
                  </Link>
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