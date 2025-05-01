import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function CreateBetPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Bet</h1>
      
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Bet Title</Label>
          <Input
            id="title"
            placeholder="e.g., Will ETH reach $4000 by end of 2024?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the terms and conditions of the bet..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Bet Amount (ETH)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
          />
        </div>

        <Button type="submit" className="w-full">
          Create Bet
        </Button>
      </form>
    </div>
  )
} 