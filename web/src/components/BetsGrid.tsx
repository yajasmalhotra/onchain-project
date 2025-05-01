"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Users } from "lucide-react"
import { useContract } from "@/hooks/useContract"
import Link from "next/link"
import { CreateBetForm } from "./CreateBetForm"
import { useAccount } from "wagmi"
import { formatEther } from "viem"

// Define bet interface
interface Bet {
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
}

export function BetsGrid() {
  const { address } = useAccount()
  const [bets, setBets] = useState<Bet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Contract interactions
  const { 
    useGetParticipantBetIds, 
    useGetBet, 
    useGetAllSide1Participants, 
    useGetAllSide2Participants 
  } = useContract()
  
  // Get all bets for the connected wallet
  const { data: betIds } = useGetParticipantBetIds(address || "0x0")
  
  useEffect(() => {
    const fetchBets = async () => {
      if (!betIds || betIds.length === 0) {
        setIsLoading(false)
        return
      }
      
      try {
        // Get all bets details
        const fetchedBets = await Promise.all(
          betIds.map(async (betId) => {
            const id = betId.toString()
            const bet = await useGetBet(id).data
            const side1Participants = await useGetAllSide1Participants(id).data || []
            const side2Participants = await useGetAllSide2Participants(id).data || []
            
            if (!bet) return null
            
            return {
              id,
              title: bet[5] as string, // title is at index 5
              creator: bet[0] as string, // owner is at index 0
              side1Title: bet[1] as string, // side1Title is at index 1
              side2Title: bet[2] as string, // side2Title is at index 2
              side1Total: formatEther(bet[3] as bigint), // side1Total is at index 3
              side2Total: formatEther(bet[4] as bigint), // side2Total is at index 4
              totalPool: formatEther((bet[3] as bigint) + (bet[4] as bigint)),
              settled: bet[6] as boolean, // settled is at index 6
              side1Participants: side1Participants.length,
              side2Participants: side2Participants.length,
              totalParticipants: side1Participants.length + side2Participants.length,
            }
          })
        )
        
        // Filter out any nulls
        const validBets = fetchedBets.filter(Boolean) as Bet[]
        setBets(validBets)
      } catch (error) {
        console.error("Error fetching bets:", error)
        setBets([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBets()
  }, [betIds])
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Active Bets</h1>
        <CreateBetForm />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white/10 border-white/20 backdrop-blur-sm animate-pulse">
              <CardHeader className="h-24"></CardHeader>
              <CardContent className="h-40"></CardContent>
            </Card>
          ))}
        </div>
      ) : bets.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl text-white/70 mb-6">No bets found</h2>
          <p className="text-white/50 mb-8">Create a new bet or join an existing one to get started.</p>
          <CreateBetForm />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bets.map((bet) => (
            <Link key={bet.id} href={`/bets/${bet.id}`}>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-white">{bet.title}</CardTitle>
                    <div className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${!bet.settled ? 'bg-neon-yellow/20 text-neon-yellow' : 
                        'bg-green-500/20 text-green-500'}
                    `}>
                      {bet.settled ? "Settled" : "Active"}
                    </div>
                  </div>
                  <CardDescription className="text-white/70">
                    Created by {bet.creator.substring(0, 6)}...{bet.creator.substring(bet.creator.length - 4)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-white/70">Total Pool</p>
                        <div className="flex items-center gap-2">
                          <Coins className="h-5 w-5 text-neon-yellow" />
                          <p className="text-lg font-medium text-white">{bet.totalPool}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-white/70">Participants</p>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-neon-yellow" />
                          <p className="text-lg font-medium text-white">{bet.totalParticipants}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-white/70">Options</p>
                      <div className="flex items-center justify-between">
                        <span className="text-neon-yellow">{bet.side1Title}</span>
                        <span className="text-neon-pink">{bet.side2Title}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 