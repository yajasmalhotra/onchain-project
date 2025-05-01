import { BetClient } from "@/components/BetClient";

export default function BetPage({ params }: { params: { id: string } }) {
  return <BetClient betId={params.id} />;
} 