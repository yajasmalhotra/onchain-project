'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateBetPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()
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

    // Here we'll prepare the bet data with the wallet address
    const betData = {
      ...formData,
      creator: address,
      // Add any additional fields needed for the bet
    }

    // Log the address and title specifically
    console.log('Wallet Address:', address)
    console.log('Bet Title:', formData.title)

    // TODO: Send betData to your backend/smart contract
    console.log('Creating bet with data:', betData)
    
    // For now, just redirect back to bets page
    router.push('/bets')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Bet</h1>
      
      {!isConnected ? (
        <div className="text-center p-6 border rounded-lg">
          <p className="text-lg mb-4">Please connect your wallet to create a bet</p>
          <Button onClick={() => window.location.reload()}>Connect Wallet</Button>
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Connected Wallet:</p>
            <p className="font-mono">{address}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button type="submit" className="w-full">
              Create Bet
            </Button>
          </form>
        </>
      )}
    </div>
  )
} 