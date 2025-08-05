"use client"

import { useState, useCallback, useEffect } from "react"

type Player = "X" | "O" | null
type Board = Player[]
type GameStatus = "idle" | "playing" | "finished"

interface PlayerStats {
  gamesPlayed: number
  wins: number
  losses: number
  ties: number
  totalEarnings: number
  winRate: number
}

export function useGame(playerAddress?: string | null) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<"X" | "O" | "tie" | null>(null)
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle")
  const [stakeAmount, setStakeAmount] = useState<number>(0)
  const [isAIThinking, setIsAIThinking] = useState(false)
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    totalEarnings: 0,
    winRate: 0,
  })

  // Load player stats from localStorage
  useEffect(() => {
    if (playerAddress) {
      const savedStats = localStorage.getItem(`player-stats-${playerAddress}`)
      if (savedStats) {
        setPlayerStats(JSON.parse(savedStats))
      }
    }
  }, [playerAddress])

  // Save player stats to localStorage
  const savePlayerStats = useCallback(
    (stats: PlayerStats) => {
      if (playerAddress) {
        localStorage.setItem(`player-stats-${playerAddress}`, JSON.stringify(stats))
        setPlayerStats(stats)
      }
    },
    [playerAddress],
  )

  const checkWinner = useCallback((board: Board): "X" | "O" | "tie" | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ]

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }

    if (board.every((cell) => cell !== null)) {
      return "tie"
    }

    return null
  }, [])

  const minimax = useCallback(
    (board: Board, depth: number, isMaximizing: boolean): number => {
      const winner = checkWinner(board)

      if (winner === "O") return 10 - depth
      if (winner === "X") return depth - 10
      if (winner === "tie") return 0

      if (isMaximizing) {
        let bestScore = Number.NEGATIVE_INFINITY
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = "O"
            const score = minimax(board, depth + 1, false)
            board[i] = null
            bestScore = Math.max(score, bestScore)
          }
        }
        return bestScore
      } else {
        let bestScore = Number.POSITIVE_INFINITY
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = "X"
            const score = minimax(board, depth + 1, true)
            board[i] = null
            bestScore = Math.min(score, bestScore)
          }
        }
        return bestScore
      }
    },
    [checkWinner],
  )

  const getAIMove = useCallback(
    (board: Board): number => {
      let bestScore = Number.NEGATIVE_INFINITY
      let bestMove = 0

      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = "O"
          const score = minimax(board, 0, false)
          board[i] = null
          if (score > bestScore) {
            bestScore = score
            bestMove = i
          }
        }
      }

      return bestMove
    },
    [minimax],
  )

  const updateStats = useCallback(
    (gameWinner: "X" | "O" | "tie" | null, payout: number) => {
      const newStats = { ...playerStats }
      newStats.gamesPlayed += 1

      if (gameWinner === "X") {
        newStats.wins += 1
        newStats.totalEarnings += payout
      } else if (gameWinner === "O") {
        newStats.losses += 1
        newStats.totalEarnings += payout // payout will be negative for losses
      } else if (gameWinner === "tie") {
        newStats.ties += 1
      }

      newStats.winRate = newStats.gamesPlayed > 0 ? Math.round((newStats.wins / newStats.gamesPlayed) * 100) : 0

      savePlayerStats(newStats)
    },
    [playerStats, savePlayerStats],
  )

  const makeMove = useCallback(
    (index: number) => {
      if (board[index] || winner || gameStatus !== "playing" || currentPlayer !== "X" || isAIThinking) {
        return
      }

      const newBoard = [...board]
      newBoard[index] = "X"
      setBoard(newBoard)

      const gameWinner = checkWinner(newBoard)
      if (gameWinner) {
        setWinner(gameWinner)
        setGameStatus("finished")

        // Update stats
        const payout = getPayout(gameWinner)
        updateStats(gameWinner, payout)
        return
      }

      setCurrentPlayer("O")
      setIsAIThinking(true)

      setTimeout(() => {
        const aiMove = getAIMove(newBoard)
        const aiBoard = [...newBoard]
        aiBoard[aiMove] = "O"
        setBoard(aiBoard)

        const aiWinner = checkWinner(aiBoard)
        if (aiWinner) {
          setWinner(aiWinner)
          setGameStatus("finished")

          // Update stats
          const payout = getPayout(aiWinner)
          updateStats(aiWinner, payout)
        } else {
          setCurrentPlayer("X")
        }
        setIsAIThinking(false)
      }, 1000)
    },
    [board, currentPlayer, winner, gameStatus, isAIThinking, checkWinner, getAIMove, updateStats],
  )

  const startGame = useCallback(() => {
    if (stakeAmount <= 0) {
      return
    }

    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
    setGameStatus("playing")
    setIsAIThinking(false)
  }, [stakeAmount])

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
    setGameStatus("idle")
    setIsAIThinking(false)
  }, [])

  const setStake = useCallback((amount: number) => {
    setStakeAmount(amount)
  }, [])

  const getPayout = useCallback(
    (gameWinner?: "X" | "O" | "tie" | null) => {
      const finalWinner = gameWinner || winner
      if (!finalWinner || stakeAmount === 0) return 0

      if (finalWinner === "X") {
        return stakeAmount + stakeAmount * 0.8
      } else if (finalWinner === "O") {
        return -stakeAmount
      } else {
        return stakeAmount
      }
    },
    [winner, stakeAmount],
  )

  return {
    board,
    currentPlayer,
    winner,
    gameStatus,
    stakeAmount,
    isAIThinking,
    playerStats,
    makeMove,
    startGame,
    resetGame,
    setStake,
    getPayout,
  }
}
