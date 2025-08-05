"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { Button } from "./ui/Button"
import { Trophy, Clock, Coins, RefreshCw, TrendingDown, Minus } from "lucide-react"
import { useGoldskyData } from "../hooks/useGoldskyData"

interface GameHistoryProps {
  playerAddress?: string
}

export function GameHistory({ playerAddress }: GameHistoryProps) {
  const { playerGames, isLoading, refreshPlayerData } = useGoldskyData(playerAddress)

  const getGameResult = (game: any, playerAddress: string) => {
    if (!game.winner) return "tie"
    return game.winner.toLowerCase() === playerAddress.toLowerCase() ? "win" : "loss"
  }

  const getOpponent = (game: any, playerAddress: string) => {
    const opponent = game.player1.toLowerCase() === playerAddress.toLowerCase() ? game.player2 : game.player1
    return `${opponent.slice(0, 6)}...${opponent.slice(-4)}`
  }

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-6">
          <div className="animate-pulse text-white">Loading game history...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Game History
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshPlayerData}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {playerGames.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No games played yet</p>
            <p className="text-gray-500 text-sm">Start playing to see your game history!</p>
          </div>
        ) : (
          playerGames.map((game) => {
            const result = getGameResult(game, playerAddress!)
            const opponent = getOpponent(game, playerAddress!)

            return (
              <div
                key={game.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {result === "win" ? (
                      <Badge className="bg-green-500/20 border-green-500/50 text-green-300">
                        <Trophy className="h-3 w-3 mr-1" />
                        Victory
                      </Badge>
                    ) : result === "loss" ? (
                      <Badge className="bg-red-500/20 border-red-500/50 text-red-300">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Defeat
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300">
                        <Minus className="h-3 w-3 mr-1" />
                        Draw
                      </Badge>
                    )}

                    {game.isActive && (
                      <Badge className="bg-blue-500/20 border-blue-500/50 text-blue-300 animate-pulse">Live</Badge>
                    )}
                  </div>

                  <div className="flex items-center text-gray-400 text-sm">
                    <Coins className="h-4 w-4 mr-1" />
                    {Number.parseFloat(game.betAmount).toFixed(4)} ETH
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Opponent:</span>
                    <span className="text-white font-mono">{opponent}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Moves:</span>
                    <span className="text-white">{game.moves.length}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">{new Date(game.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Game Board Preview */}
                {game.moves.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="grid grid-cols-3 gap-1 max-w-24 mx-auto">
                      {Array.from({ length: 9 }, (_, i) => {
                        const move = game.moves.find((m) => m.position === i)
                        const isPlayer1 = move?.player.toLowerCase() === game.player1.toLowerCase()
                        return (
                          <div
                            key={i}
                            className="aspect-square bg-white/10 rounded flex items-center justify-center text-xs font-bold"
                          >
                            {move ? (isPlayer1 ? "X" : "O") : ""}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
