import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Bets</h1>
        <Button asChild>
          <Link href="/bets/create">Create New Bet</Link>
        </Button>
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