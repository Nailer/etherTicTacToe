"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { TrendingUp, Target, Coins, Calendar, Flame, Award } from "lucide-react"
import { useGoldskyData } from "../hooks/useGoldskyData"

interface PlayerAnalyticsProps {
  playerAddress?: string
}

export function PlayerAnalytics({ playerAddress }: PlayerAnalyticsProps) {
  const { playerStats, isLoading } = useGoldskyData(playerAddress)

  if (isLoading || !playerStats) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-6">
          <div className="animate-pulse text-white">Loading analytics...</div>
        </CardContent>
      </Card>
    )
  }

  const profitLoss = Number.parseFloat(playerStats.totalWinnings) - Number.parseFloat(playerStats.totalStaked)
  const avgBetSize =
    playerStats.gamesPlayed > 0 ? Number.parseFloat(playerStats.totalStaked) / playerStats.gamesPlayed : 0

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Player Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-white">{playerStats.winRate}%</div>
            <div className="text-xs text-gray-400">Win Rate</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-white">{playerStats.gamesPlayed}</div>
            <div className="text-xs text-gray-400">Total Games</div>
          </div>
        </div>

        {/* Profit/Loss */}
        <div className="space-y-3">
          <h4 className="text-white text-sm font-medium">Financial Performance</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Total Winnings</span>
              <span className="text-green-400 font-semibold">
                +{Number.parseFloat(playerStats.totalWinnings).toFixed(4)} ETH
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Total Staked</span>
              <span className="text-gray-400 font-semibold">
                -{Number.parseFloat(playerStats.totalStaked).toFixed(4)} ETH
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-white/20 pt-2">
              <span className="text-white text-sm font-medium">Net Profit/Loss</span>
              <span className={`font-bold ${profitLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                {profitLoss >= 0 ? "+" : ""}
                {profitLoss.toFixed(4)} ETH
              </span>
            </div>
          </div>
        </div>

        {/* Game Statistics */}
        <div className="space-y-3">
          <h4 className="text-white text-sm font-medium">Game Statistics</h4>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-green-500/10 rounded border border-green-500/30">
              <div className="text-lg font-bold text-green-400">{playerStats.gamesWon}</div>
              <div className="text-xs text-green-300">Wins</div>
            </div>
            <div className="p-2 bg-red-500/10 rounded border border-red-500/30">
              <div className="text-lg font-bold text-red-400">{playerStats.gamesLost}</div>
              <div className="text-xs text-red-300">Losses</div>
            </div>
            <div className="p-2 bg-yellow-500/10 rounded border border-yellow-500/30">
              <div className="text-lg font-bold text-yellow-400">{playerStats.gamesTied}</div>
              <div className="text-xs text-yellow-300">Ties</div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm flex items-center">
              <Coins className="h-4 w-4 mr-1" />
              Avg Bet Size
            </span>
            <span className="text-white font-semibold">{avgBetSize.toFixed(4)} ETH</span>
          </div>

          {playerStats.currentWinStreak !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm flex items-center">
                <Flame className="h-4 w-4 mr-1" />
                Current Streak
              </span>
              <Badge
                className={`${
                  playerStats.currentWinStreak > 0
                    ? "bg-green-500/20 border-green-500/50 text-green-300"
                    : "bg-gray-500/20 border-gray-500/50 text-gray-300"
                }`}
              >
                {playerStats.currentWinStreak} wins
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Last Game
            </span>
            <span className="text-white text-sm">{new Date(playerStats.lastGameAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm flex items-center">
              <Award className="h-4 w-4 mr-1" />
              Member Since
            </span>
            <span className="text-white text-sm">{new Date(playerStats.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Performance Badge */}
        <div className="text-center pt-3 border-t border-white/20">
          {playerStats.winRate >= 80 ? (
            <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-300">
              <Award className="h-3 w-3 mr-1" />
              Elite Player
            </Badge>
          ) : playerStats.winRate >= 60 ? (
            <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-300">
              <Target className="h-3 w-3 mr-1" />
              Skilled Player
            </Badge>
          ) : playerStats.winRate >= 40 ? (
            <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/50 text-blue-300">
              <TrendingUp className="h-3 w-3 mr-1" />
              Improving
            </Badge>
          ) : (
            <Badge className="bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/50 text-gray-300">
              Beginner
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
