"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GameStatsProps {
  currentPlayer: "X" | "O"
  gameStatus: string
  winner: "X" | "O" | "tie" | null
}

export function GameStats({ currentPlayer, gameStatus, winner }: GameStatsProps) {
  const getStatusMessage = () => {
    if (winner) {
      if (winner === "tie") return "Game ended in a tie!"
      return `Player ${winner} wins the game!`
    }

    if (gameStatus === "playing") {
      return `Player ${currentPlayer}'s turn`
    }

    return "Click Start Game to begin"
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Game Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Badge
            variant="outline"
            className={`${
              gameStatus === "playing"
                ? "bg-green-500/20 border-green-500/50 text-green-300"
                : gameStatus === "finished"
                  ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                  : "bg-gray-500/20 border-gray-500/50 text-gray-300"
            } text-lg px-4 py-2`}
          >
            {gameStatus === "playing" ? "Game Active" : gameStatus === "finished" ? "Game Over" : "Ready to Play"}
          </Badge>
        </div>

        <div className="text-center">
          <p className="text-gray-300 text-sm mb-2">Status:</p>
          <p className="text-white font-medium">{getStatusMessage()}</p>
        </div>

        {gameStatus === "playing" && (
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 ${
                  currentPlayer === "X"
                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                    : "bg-white/10 border-white/20 text-gray-400"
                }`}
              >
                X
              </div>
              <p className="text-xs text-gray-400 mt-1">Player X</p>
            </div>
            <div className="text-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 ${
                  currentPlayer === "O"
                    ? "bg-purple-500/20 border-purple-500 text-purple-400"
                    : "bg-white/10 border-white/20 text-gray-400"
                }`}
              >
                O
              </div>
              <p className="text-xs text-gray-400 mt-1">Player O</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
