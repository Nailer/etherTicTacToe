"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { Button } from "./ui/Button"
import { Trophy, TrendingUp, Target, RefreshCw, Crown, Medal, Award } from "lucide-react"
import { useGoldskyData } from "../hooks/useGoldskyData"

interface LeaderboardProps {
  playerAddress?: string
}

export function Leaderboard({ playerAddress }: LeaderboardProps) {
  const { leaderboard, isLoading, refreshLeaderboard } = useGoldskyData(playerAddress)

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-400" />
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 2:
        return <Award className="h-5 w-5 text-orange-400" />
      default:
        return <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
    }
  }

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50"
      case 1:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50"
      case 2:
        return "bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/50"
      default:
        return "bg-white/5 border-white/10"
    }
  }

  const isCurrentPlayer = (playerId: string) => {
    return playerAddress && playerId.toLowerCase() === playerAddress.toLowerCase()
  }

  if (isLoading) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-6">
          <div className="animate-pulse text-white">Loading leaderboard...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Leaderboard
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshLeaderboard}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No players yet</p>
            <p className="text-gray-500 text-sm">Be the first to play and claim the top spot!</p>
          </div>
        ) : (
          leaderboard.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:scale-[1.02] ${getRankStyle(index)} ${
                isCurrentPlayer(player.id) ? "ring-2 ring-cyan-500/50" : ""
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10">{getRankIcon(index)}</div>

                <div>
                  <div className="flex items-center space-x-2">
                    <div className="text-white font-medium font-mono">
                      {player.id.slice(0, 6)}...{player.id.slice(-4)}
                    </div>
                    {isCurrentPlayer(player.id) && (
                      <Badge className="bg-cyan-500/20 border-cyan-500/50 text-cyan-300 text-xs">You</Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                    <span className="flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      {player.gamesWon}W/{player.gamesLost}L/{player.gamesTied}T
                    </span>
                    <span className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {player.winRate}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-green-400 font-bold text-lg">
                  +{Number.parseFloat(player.totalWinnings).toFixed(4)} ETH
                </div>
                <div className="text-gray-400 text-xs">
                  Staked: {Number.parseFloat(player.totalStaked).toFixed(4)} ETH
                </div>
                <Badge
                  variant="outline"
                  className={`mt-1 text-xs ${
                    player.winRate >= 70
                      ? "bg-green-500/20 border-green-500/50 text-green-300"
                      : player.winRate >= 50
                        ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-300"
                        : "bg-red-500/20 border-red-500/50 text-red-300"
                  }`}
                >
                  {player.gamesPlayed} games
                </Badge>
              </div>
            </div>
          ))
        )}

        {/* Player's rank if not in top 10 */}
        {playerAddress && !leaderboard.some((p) => isCurrentPlayer(p.id)) && (
          <div className="border-t border-white/20 pt-3 mt-4">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-center">
              <p className="text-cyan-300 text-sm">Your rank will appear here after playing more games!</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
