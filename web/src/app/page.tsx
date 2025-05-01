import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Betting Platform</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Create and enter bets on the blockchain. A decentralized platform for fair and transparent betting.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/bets">View Bets</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/bets/create">Create Bet</Link>
        </Button>
      </div>
    </div>
  )
}
