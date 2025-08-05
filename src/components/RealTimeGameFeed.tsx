"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { Button } from "./ui/Button"
import { Zap, Users, RefreshCw, Activity, Clock } from "lucide-react"
import { useGoldskyData } from "../hooks/useGoldskyData"

export function RealTimeGameFeed() {
  const { recentMoves, isLoading, refreshRecentMoves } = useGoldskyData()

  const getPositionName = (position: number) => {
    const positions = [
      "Top Left",
      "Top Center",
      "Top Right",
      "Middle Left",
      "Center",
      "Middle Right",
      "Bottom Left",
      "Bottom Center",
      "Bottom Right",
    ]
    return positions[position] || `Position ${position + 1}`
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const moveTime = new Date(timestamp)
    const diffMs = now.getTime() - moveTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return moveTime.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-6">
          <div className="animate-pulse text-white">Loading live feed...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Live Game Feed
            <Badge className="bg-green-500/20 border-green-500/50 text-green-300 ml-2 animate-pulse">
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshRecentMoves}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {recentMoves.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No recent activity</p>
            <p className="text-gray-500 text-sm">Game moves will appear here in real-time!</p>
          </div>
        ) : (
          recentMoves.map((move, index) => (
            <div
              key={`${move.id}-${index}`}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-cyan-400" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-mono text-sm">
                      {move.player.slice(0, 6)}...{move.player.slice(-4)}
                    </span>
                    <span className="text-gray-400 text-sm">played</span>
                    <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-xs">
                      {getPositionName(move.position)}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {getTimeAgo(move.timestamp)}
                    </span>
                    <span>Stake: {Number.parseFloat(move.game.betAmount).toFixed(4)} ETH</span>
                    {move.game.isActive && (
                      <Badge className="bg-green-500/20 border-green-500/50 text-green-300 text-xs">Active</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-gray-400 text-xs">Block #{move.blockNumber}</div>
                <div className="text-gray-500 text-xs">Game {move.game.id.slice(0, 8)}...</div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
