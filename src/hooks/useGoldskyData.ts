"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getPlayerGames,
  getLeaderboard,
  getRecentMoves,
  getPlayerStats,
  subscribeToGames,
  subscribeToMoves,
} from "../lib/goldsky"

interface PlayerGameData {
  id: string
  player1: string
  player2: string
  winner: string | null
  betAmount: string
  createdAt: string
  isActive: boolean
  moves: Array<{
    id: string
    player: string
    position: number
    timestamp: string
    blockNumber?: number
  }>
}

interface LeaderboardEntry {
  id: string
  gamesWon: number
  gamesPlayed: number
  gamesLost: number
  gamesTied: number
  totalWinnings: string
  totalStaked: string
  winRate: number
  lastGameAt: string
  createdAt: string
}

interface RecentMove {
  id: string
  player: string
  position: number
  timestamp: string
  blockNumber: number
  game: {
    id: string
    player1: string
    player2: string
    betAmount: string
    isActive: boolean
  }
}

interface PlayerStats {
  id: string
  gamesWon: number
  gamesPlayed: number
  gamesLost: number
  gamesTied: number
  totalWinnings: string
  totalStaked: string
  winRate: number
  longestWinStreak?: number
  currentWinStreak?: number
  lastGameAt: string
  createdAt: string
  recentGames?: PlayerGameData[]
}

export function useGoldskyData(playerAddress?: string) {
  // 🔍 Debug: Log when Goldsky hook is used
  console.log("🔍 Goldsky Hook Active for player:", playerAddress)

  const [playerGames, setPlayerGames] = useState<PlayerGameData[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [recentMoves, setRecentMoves] = useState<RecentMove[]>([])
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch player's game history
  const fetchPlayerGames = useCallback(async () => {
    if (!playerAddress) return

    try {
      const games = await getPlayerGames(playerAddress, 20)
      setPlayerGames(games)
    } catch (err) {
      setError("Failed to fetch player games")
      console.error(err)
    }
  }, [playerAddress])

  // Fetch player detailed stats
  const fetchPlayerStats = useCallback(async () => {
    if (!playerAddress) return

    try {
      const stats = await getPlayerStats(playerAddress)
      setPlayerStats(stats)
    } catch (err) {
      console.error("Failed to fetch player stats:", err)
    }
  }, [playerAddress])

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      const leaders = await getLeaderboard(15)
      setLeaderboard(leaders)
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err)
    }
  }, [])

  // Fetch recent moves
  const fetchRecentMoves = useCallback(async () => {
    try {
      const moves = await getRecentMoves(30)
      setRecentMoves(moves)
    } catch (err) {
      console.error("Failed to fetch recent moves:", err)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        await Promise.all([fetchPlayerGames(), fetchPlayerStats(), fetchLeaderboard(), fetchRecentMoves()])
      } catch (err) {
        setError("Failed to fetch data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
  }, [fetchPlayerGames, fetchPlayerStats, fetchLeaderboard, fetchRecentMoves])

  // Set up real-time subscriptions
  useEffect(() => {
    const unsubscribeGames = subscribeToGames((data) => {
      if (data.games) {
        // Update player games if they're involved
        if (playerAddress) {
          const playerGames = data.games.filter(
            (game: any) =>
              game.player1.toLowerCase() === playerAddress.toLowerCase() ||
              game.player2.toLowerCase() === playerAddress.toLowerCase(),
          )
          if (playerGames.length > 0) {
            setPlayerGames((prev) => {
              const newGames = [...playerGames, ...prev]
              return newGames.filter((game, index, self) => index === self.findIndex((g) => g.id === game.id))
            })
          }
        }
      }
    })

    const unsubscribeMoves = subscribeToMoves((data) => {
      if (data.moves) {
        setRecentMoves(data.moves)
      }
    })

    return () => {
      unsubscribeGames?.()
      unsubscribeMoves?.()
    }
  }, [playerAddress])

  // Refresh functions
  const refreshPlayerData = useCallback(() => {
    fetchPlayerGames()
    fetchPlayerStats()
  }, [fetchPlayerGames, fetchPlayerStats])

  const refreshLeaderboard = useCallback(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  const refreshRecentMoves = useCallback(() => {
    fetchRecentMoves()
  }, [fetchRecentMoves])

  return {
    // Data
    playerGames,
    leaderboard,
    recentMoves,
    playerStats,

    // State
    isLoading,
    error,

    // Actions
    refreshPlayerData,
    refreshLeaderboard,
    refreshRecentMoves,
  }
}
