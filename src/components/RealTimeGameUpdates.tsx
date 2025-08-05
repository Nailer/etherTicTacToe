"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { Zap, Users } from "lucide-react"
import { useGoldskyData } from "../hooks/useGoldskyData"

interface GameUpdate {
  gameId: string
  player: string
  position: number
  timestamp: string
}

export function RealTimeGameUpdates() {
  const [recentMoves, setRecentMoves] = useState<GameUpdate[]>([])
  const { subscribeToGameUpdates } = useGoldskyData()

  useEffect(() => {
    // Subscribe to all game updates (in production, you'd filter by active games)
    const unsubscribe = subscribeToGameUpdates("*", (data) => {
      if (data.game?.moves) {
        const latestMove = data.game.moves[data.game.moves.length - 1]
        setRecentMoves((prev) => [
          {
            gameId: data.game.id,
            player: latestMove.player,
            position: latestMove.position,
            timestamp: latestMove.timestamp,
          },
          ...prev.slice(0, 9), // Keep only last 10 moves
        ])
      }
    })

    return () => unsubscribe?.()
  }, [subscribeToGameUpdates])

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Live Game Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-64 overflow-y-auto">
        {recentMoves.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No recent moves</p>
        ) : (
          recentMoves.map((move, index) => (
            <div
              key={`${move.gameId}-${move.timestamp}-${index}`}
              className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10"
            >
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <span className="text-white text-sm">
                  {move.player.slice(0, 6)}...{move.player.slice(-4)}
                </span>
                <span className="text-gray-400 text-sm">played position {move.position + 1}</span>
              </div>
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-xs">
                {new Date(move.timestamp).toLocaleTimeString()}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
