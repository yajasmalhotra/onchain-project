"use client"

import { useState } from "react"
import { useContract } from "@/hooks/useContract"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { parseEther } from "viem"
import { useAccount } from "wagmi"

export function CreateBetForm() {
  const { address } = useAccount()
  const { useCreateBet } = useContract()
  const { createBet, isLoading, isSuccess } = useCreateBet()
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    side1Title: "",
    side2Title: "",
    amount: "",
  })
  const [error, setError] = useState("")
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleOpenDialog = () => {
    if (!address) {
      setError("Please connect your wallet first")
      return
    }
    
    setError("")
    setDialogOpen(true)
  }
  
  const handleCreateBet = async () => {
    // Validate form
    if (!formData.title || !formData.side1Title || !formData.side2Title) {
      setError("Please fill in all required fields")
      return
    }
    
    try {
      // Call contract function to create the bet
      await createBet({
        title: formData.title,
        side1Title: formData.side1Title,
        side2Title: formData.side2Title,
      })
      
      // Reset form if successful
      if (isSuccess) {
        setFormData({
          title: "",
          side1Title: "",
          side2Title: "",
          amount: "",
        })
        setDialogOpen(false)
      }
    } catch (error) {
      console.error("Error creating bet:", error)
      setError("Failed to create bet. Please try again.")
    }
  }
  
  return (
    <div>
      <Button 
        className="bg-neon-pink text-white hover:bg-neon-pink/90"
        onClick={handleOpenDialog}
      >
        Create New Bet
      </Button>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-black/90 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-neon-pink">Create New Bet</DialogTitle>
            <DialogDescription className="text-white/70">
              Fill in the details to create a new bet
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm text-white/70">Title</label>
              <Input
                id="title"
                name="title"
                placeholder="Will ETH price reach $3,000?"
                className="bg-black/60 border-white/20 text-white"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="side1Title" className="text-sm text-white/70">Side 1 Title</label>
              <Input
                id="side1Title"
                name="side1Title"
                placeholder="Yes, it will"
                className="bg-black/60 border-white/20 text-white"
                value={formData.side1Title}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="side2Title" className="text-sm text-white/70">Side 2 Title</label>
              <Input
                id="side2Title"
                name="side2Title"
                placeholder="No, it won't"
                className="bg-black/60 border-white/20 text-white"
                value={formData.side2Title}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-neon-pink text-white hover:bg-neon-pink/90" 
              onClick={handleCreateBet}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Bet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 