"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { Loader2 } from "lucide-react"

type Player = "X" | "O" | null
type Board = Player[]

interface GameBoardProps {
  board: Board
  winner: "X" | "O" | "tie" | null
  gameStatus: string
  currentPlayer: "X" | "O"
  isAIThinking: boolean
  stakeAmount: number
  onMakeMove: (index: number) => void
}

export function GameBoard({
  board,
  winner,
  gameStatus,
  currentPlayer,
  isAIThinking,
  stakeAmount,
  onMakeMove,
}: GameBoardProps) {
  const renderSquare = (index: number) => {
    const value = board[index]
    const canMove = !value && !winner && gameStatus === "playing" && currentPlayer === "X" && !isAIThinking

    return (
      <button
        key={index}
        className={`
          aspect-square bg-white/10 backdrop-blur-lg rounded-lg 
          flex items-center justify-center text-4xl font-bold 
          border-2 transition-all duration-200
          ${
            canMove
              ? "border-white/40 hover:border-white/60 hover:bg-white/20 cursor-pointer hover:scale-105"
              : "border-white/20 cursor-not-allowed opacity-75"
          }
          ${winner && "opacity-50"}
        `}
        onClick={() => onMakeMove(index)}
        disabled={!canMove}
      >
        <span className={`${value === "X" ? "text-cyan-400" : "text-purple-400"} transition-all duration-300`}>
          {value}
        </span>
      </button>
    )
  }

  const getStatusMessage = () => {
    if (winner) {
      if (winner === "tie") return "Game ended in a tie!"
      if (winner === "X") return "You beat the AI! 🎉"
      return "AI wins this round!"
    }

    if (gameStatus === "playing") {
      if (isAIThinking) return "AI is thinking..."
      if (currentPlayer === "X") return "Your turn - click any empty square"
      return "AI's turn"
    }

    if (stakeAmount === 0) return "Set your stake amount to start playing"
    return "Click Start Game to challenge the AI"
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-2xl">Tic-Tac-Toe vs AI</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className={`${
                gameStatus === "playing"
                  ? "bg-green-500/20 border-green-500/50 text-green-300"
                  : gameStatus === "finished"
                    ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                    : "bg-gray-500/20 border-gray-500/50 text-gray-300"
              }`}
            >
              {gameStatus === "playing" ? "Playing" : gameStatus === "finished" ? "Finished" : "Ready"}
            </Badge>
            {isAIThinking && (
              <Badge className="bg-purple-500/20 border-purple-500/50 text-purple-300">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                AI Thinking
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="text-gray-300">{getStatusMessage()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
          {board.map((_, index) => renderSquare(index))}
        </div>

        {gameStatus === "idle" && stakeAmount === 0 && (
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">Set your stake amount and challenge the AI to win rewards!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
