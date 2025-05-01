import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useToast } from '@/components/ui/use-toast'
import { formatEther, parseEther } from 'viem'

// Contract address
export const CONTRACT_ADDRESS = '0x097b713beb1156459f89f33b82028c53675c0979'

// Contract ABI
export const CONTRACT_ABI = [{ "inputs": [{ "internalType": "address", "name": "_admin", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "BetAlreadySettled", "type": "error" }, { "inputs": [], "name": "InvalidSide", "type": "error" }, { "inputs": [], "name": "OnlyOwnerCanSettle", "type": "error" }, { "inputs": [], "name": "OwnerCannotJoin", "type": "error" }, { "inputs": [], "name": "ParticipantAlreadyJoined", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "betId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "dest", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "PayedOut", "type": "event" }, { "inputs": [], "name": "admin", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "betTransactionFeePercent", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "bets", "outputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "string", "name": "side1Title", "type": "string" }, { "internalType": "string", "name": "side2Title", "type": "string" }, { "internalType": "uint256", "name": "side1Total", "type": "uint256" }, { "internalType": "uint256", "name": "side2Total", "type": "uint256" }, { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "bool", "name": "settled", "type": "bool" }, { "internalType": "uint32", "name": "winningSide", "type": "uint32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "side1Title", "type": "string" }, { "internalType": "string", "name": "side2Title", "type": "string" }], "name": "createBet", "outputs": [{ "internalType": "uint256", "name": "betId", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "betId", "type": "uint256" }], "name": "getAllSide1ParticipantsForBet", "outputs": [{ "components": [{ "internalType": "address", "name": "_address", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "internalType": "struct Bets.Participant[]", "name": "participants", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "betId", "type": "uint256" }], "name": "getAllSide2ParticipantsForBet", "outputs": [{ "components": [{ "internalType": "address", "name": "_address", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "internalType": "struct Bets.Participant[]", "name": "participants", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "getOwnerBetIds", "outputs": [{ "internalType": "uint256[]", "name": "betIds", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "participant", "type": "address" }], "name": "getParticipantBetIds", "outputs": [{ "internalType": "uint256[]", "name": "betIds", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "betId", "type": "uint256" }, { "internalType": "uint32", "name": "side", "type": "uint32" }], "name": "joinBet", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "ownerBetIds", "outputs": [{ "internalType": "uint256", "name": "betIds", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "participant", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "participantBetIds", "outputs": [{ "internalType": "uint256", "name": "betIds", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "betId", "type": "uint256" }, { "internalType": "uint32", "name": "winningSide", "type": "uint32" }], "name": "settleBet", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "betId", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "side1Participants", "outputs": [{ "internalType": "address", "name": "_address", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "betId", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "name": "side2Participants", "outputs": [{ "internalType": "address", "name": "_address", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "stateMutability": "view", "type": "function" }] as const

// Interfaces for contract data
export interface Participant {
  _address: string;
  amount: bigint;
}

export interface Bet {
  owner: string;
  side1Title: string;
  side2Title: string;
  side1Total: bigint;
  side2Total: bigint;
  title: string;
  settled: boolean;
}

export function useContract() {
  const { toast } = useToast()

  // Read Functions
  const useGetBet = (betId: string | number) => {
    return useReadContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'bets',
      args: [BigInt(betId)],
    })
  }

  const useGetAllSide1Participants = (betId: string | number) => {
    return useReadContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getAllSide1ParticipantsForBet',
      args: [BigInt(betId)],
    })
  }

  const useGetAllSide2Participants = (betId: string | number) => {
    return useReadContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getAllSide2ParticipantsForBet',
      args: [BigInt(betId)],
    })
  }

  const useGetOwnerBetIds = (ownerAddress: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getOwnerBetIds',
      args: [ownerAddress as `0x${string}`],
    })
  }

  const useGetParticipantBetIds = (participantAddress: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getParticipantBetIds',
      args: [participantAddress as `0x${string}`],
    })
  }

  // Write Functions
  const useCreateBet = () => {
    const { writeContract, data, error, isPending, reset } = useWriteContract()

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
      hash: data,
    })

    const createBet = async ({
      title,
      side1Title,
      side2Title
    }: {
      title: string;
      side1Title: string;
      side2Title: string;
    }) => {
      try {
        return writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: 'createBet',
          args: [title, side1Title, side2Title],
        })
      } catch (error) {
        console.error(`Error creating bet:`, error)
        toast({
          title: 'Transaction Failed',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive',
        })
        throw error
      }
    }

    return {
      createBet,
      data,
      error,
      isLoading: isPending || isConfirming,
      isSuccess,
      reset,
    }
  }

  const useJoinBet = () => {
    const { writeContract, data, error, isPending, reset } = useWriteContract()

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
      hash: data,
    })

    const joinBet = async ({
      betId,
      side,
      amount
    }: {
      betId: string | number;
      side: 1 | 2; // Side 1 or Side 2
      amount: string; // Amount in ETH
    }) => {
      try {
        const amountInWei = parseEther(amount)
        return writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: 'joinBet',
          args: [BigInt(betId), side],
          value: amountInWei,
        })
      } catch (error) {
        console.error(`Error joining bet:`, error)
        toast({
          title: 'Transaction Failed',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive',
        })
        throw error
      }
    }

    return {
      joinBet,
      data,
      error,
      isLoading: isPending || isConfirming,
      isSuccess,
      reset,
    }
  }

  const useSettleBet = () => {
    const { writeContract, data, error, isPending, reset } = useWriteContract()

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
      hash: data,
    })

    const settleBet = async ({
      betId,
      winningSide
    }: {
      betId: string | number;
      winningSide: 1 | 2; // Which side won
    }) => {
      try {
        return writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: 'settleBet',
          args: [BigInt(betId), winningSide],
        })
      } catch (error) {
        console.error(`Error settling bet:`, error)
        toast({
          title: 'Transaction Failed',
          description: error instanceof Error ? error.message : 'Unknown error',
          variant: 'destructive',
        })
        throw error
      }
    }

    return {
      settleBet,
      data,
      error,
      isLoading: isPending || isConfirming,
      isSuccess,
      reset,
    }
  }

  return {
    // Read methods
    useGetBet,
    useGetAllSide1Participants,
    useGetAllSide2Participants,
    useGetOwnerBetIds,
    useGetParticipantBetIds,

    // Write methods
    useCreateBet,
    useJoinBet,
    useSettleBet,
  }
} 