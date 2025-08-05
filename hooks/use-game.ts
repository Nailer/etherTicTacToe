"use client"

import { useState, useCallback } from "react"

type Player = "X" | "O" | null
type Board = Player[]
type GameStatus = "idle" | "playing" | "finished"

export function useGame() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<"X" | "O" | "tie" | null>(null)
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle")
  const [stakeAmount, setStakeAmount] = useState<number>(0)
  const [isAIThinking, setIsAIThinking] = useState(false)

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

  // Minimax algorithm for AI (Hard difficulty)
  const minimax = useCallback(
    (board: Board, depth: number, isMaximizing: boolean): number => {
      const winner = checkWinner(board)

      if (winner === "O") return 10 - depth // AI wins (O)
      if (winner === "X") return depth - 10 // Human wins (X)
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

  const makeMove = useCallback(
    (index: number) => {
      if (board[index] || winner || gameStatus !== "playing" || currentPlayer !== "X" || isAIThinking) {
        return
      }

      // Human move (X)
      const newBoard = [...board]
      newBoard[index] = "X"
      setBoard(newBoard)

      const gameWinner = checkWinner(newBoard)
      if (gameWinner) {
        setWinner(gameWinner)
        setGameStatus("finished")
        return
      }

      // Switch to AI turn
      setCurrentPlayer("O")
      setIsAIThinking(true)

      // AI move with delay for better UX
      setTimeout(() => {
        const aiMove = getAIMove(newBoard)
        const aiBoard = [...newBoard]
        aiBoard[aiMove] = "O"
        setBoard(aiBoard)

        const aiWinner = checkWinner(aiBoard)
        if (aiWinner) {
          setWinner(aiWinner)
          setGameStatus("finished")
        } else {
          setCurrentPlayer("X")
        }
        setIsAIThinking(false)
      }, 1000) // 1 second delay for AI move
    },
    [board, currentPlayer, winner, gameStatus, isAIThinking, checkWinner, getAIMove],
  )

  const startGame = useCallback(() => {
    if (stakeAmount <= 0) {
      return // Can't start without stake
    }

    setBoard(Array(9).fill(null))
    setCurrentPlayer("X") // Human always goes first
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

  const getPayout = useCallback(() => {
    if (!winner || stakeAmount === 0) return 0

    if (winner === "X") {
      // Human wins - get stake back + 80% profit
      return stakeAmount + stakeAmount * 0.8
    } else if (winner === "O") {
      // AI wins - lose stake
      return -stakeAmount
    } else {
      // Tie - get stake back
      return stakeAmount
    }
  }, [winner, stakeAmount])

  return {
    board,
    currentPlayer,
    winner,
    gameStatus,
    stakeAmount,
    isAIThinking,
    makeMove,
    startGame,
    resetGame,
    setStake,
    getPayout,
  }
}
