'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Temporary mock data - will be replaced with real data later
const mockBets = [
  {
    id: '1',
    title: 'Will ETH reach $4000 by end of 2024?',
    creator: '0x123...abc',
    amount: '0.1 ETH',
    participants: 5,
    endDate: '2024-12-31',
  },
  {
    id: '2',
    title: 'Will Bitcoin halving happen before May 2024?',
    creator: '0x456...def',
    amount: '0.05 ETH',
    participants: 3,
    endDate: '2024-05-01',
  },
]

export default function BetsPage() {
  const { address, isConnected } = useAccount()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    endDate: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    // Log the address and title specifically
    console.log('Wallet Address:', address)
    console.log('Bet Title:', formData.title)

    // Show confirmation
    alert('Bet created successfully!')
    
    // Close the modal
    setOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Bets</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create New Bet</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Bet</DialogTitle>
              <DialogDescription>
                Create a new bet for others to participate in.
              </DialogDescription>
            </DialogHeader>
            {!isConnected ? (
              <div className="text-center p-6">
                <p className="text-lg mb-4">Please connect your wallet to create a bet</p>
                <Button onClick={() => window.location.reload()}>Connect Wallet</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Bet Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Will ETH reach $4000 by end of 2024?"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the terms and conditions of the bet..."
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Bet Amount (ETH)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.1"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <DialogFooter>
                  <Button 
                    onClick={() => {
                      console.log('Wallet Address:', address)
                      console.log('Bet Title:', formData.title)
                      alert('Bet created successfully!')
                      setOpen(false)
                    }}
                  >
                    Create Bet
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {mockBets.map((bet) => (
          <div
            key={bet.id}
            className="border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{bet.title}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p>Creator: {bet.creator}</p>
                <p>Amount: {bet.amount}</p>
              </div>
              <div>
                <p>Participants: {bet.participants}</p>
                <p>End Date: {bet.endDate}</p>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Enter Bet
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 