"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, RotateCcw, Trophy, DollarSign } from "lucide-react"

interface GameControlsProps {
  gameStatus: string
  winner: "X" | "O" | "tie" | null
  stakeAmount: number
  payout: number
  onStartGame: () => void
  onResetGame: () => void
}

export function GameControls({ gameStatus, winner, stakeAmount, payout, onStartGame, onResetGame }: GameControlsProps) {
  const canStart = stakeAmount > 0 && gameStatus === "idle"

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Game Controls</CardTitle>
        <CardDescription className="text-gray-300">
          {stakeAmount > 0 ? `Stake: ${stakeAmount} ETH` : "Set your stake amount first"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {gameStatus === "idle" ? (
          <Button
            onClick={onStartGame}
            disabled={!canStart}
            className={`w-full ${
              canStart
                ? "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            <Play className="h-4 w-4 mr-2" />
            {canStart ? "Start Game vs AI" : "Set Stake First"}
          </Button>
        ) : (
          <Button
            onClick={onResetGame}
            variant="outline"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Game
          </Button>
        )}

        {winner && payout !== 0 && (
          <div
            className={`${
              payout > 0
                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50"
                : "bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/50"
            } border rounded-lg p-4 text-center`}
          >
            <Trophy className={`h-8 w-8 mx-auto mb-2 ${payout > 0 ? "text-green-400" : "text-red-400"}`} />
            <h3 className="text-lg font-bold text-white mb-1">
              {winner === "tie" ? "It's a Tie!" : winner === "X" ? "You Win!" : "AI Wins!"}
            </h3>
            <div className="flex items-center justify-center space-x-2">
              <DollarSign className={`h-5 w-5 ${payout > 0 ? "text-green-400" : "text-red-400"}`} />
              <span className={`text-xl font-bold ${payout > 0 ? "text-green-400" : "text-red-400"}`}>
                {payout > 0 ? "+" : ""}
                {payout.toFixed(4)} ETH
              </span>
            </div>
            <p className="text-gray-300 text-sm mt-2">
              {payout > 0 ? "Winnings sent to wallet!" : "Better luck next time!"}
            </p>
          </div>
        )}

        {winner && payout === 0 && (
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-lg p-4 text-center">
            <Trophy className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">It's a Tie!</h3>
            <p className="text-gray-300 text-sm">Your stake has been returned</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
