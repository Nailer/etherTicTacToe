"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Button } from "./ui/Button"
import { Badge } from "./ui/Badge"
import { User, Trophy, Target, Zap, MessageSquare, Loader2 } from "lucide-react"

interface SequenceUser {
  sub: string
  email?: string
  name?: string
  picture?: string
  email_verified?: boolean
}

interface PlayerStats {
  gamesPlayed: number
  wins: number
  losses: number
  ties: number
  totalEarnings: number
  winRate: number
}

interface PlayerProfileProps {
  user?: SequenceUser | null
  address?: string | null
  stats: PlayerStats
  onSignMessage: (message: string) => Promise<string | null>
}

export function PlayerProfile({ user, address, stats, onSignMessage }: PlayerProfileProps) {
  const [isSigningMessage, setIsSigningMessage] = useState(false)
  const [signedMessage, setSignedMessage] = useState<string | null>(null)

  const handleSignMessage = async () => {
    setIsSigningMessage(true)
    try {
      const message = `Hello from EtherTicTac! Signed by ${user?.name || "Anonymous"} at ${new Date().toISOString()}`
      const signature = await onSignMessage(message)
      if (signature) {
        setSignedMessage(signature)
      }
    } catch (error) {
      console.error("Failed to sign message:", error)
    } finally {
      setIsSigningMessage(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="h-5 w-5 mr-2" />
            Player Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar and Info */}
          <div className="text-center">
            {user?.picture ? (
              <img
                src={user.picture || "/placeholder.svg"}
                alt={user.name || "User"}
                className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-cyan-500"
              />
            ) : (
              <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-cyan-500">
                <User className="h-10 w-10 text-cyan-400" />
              </div>
            )}

            <h3 className="text-white font-bold text-lg">{user?.name || "Anonymous Player"}</h3>

            {user?.email && <p className="text-gray-400 text-sm mb-2">{user.email}</p>}

            <div className="flex items-center justify-center space-x-2">
              <Badge variant="outline" className="bg-purple-500/20 border-purple-500/50 text-purple-300 text-xs">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </Badge>
              {user?.email_verified && (
                <Badge className="bg-green-500/20 border-green-500/50 text-green-300 text-xs">Verified</Badge>
              )}
            </div>
          </div>

          {/* Sign Message Feature */}
          <div className="space-y-2">
            <Button
              onClick={handleSignMessage}
              disabled={isSigningMessage}
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {isSigningMessage ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Sign Message
                </>
              )}
            </Button>

            {signedMessage && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-2">
                <p className="text-green-300 text-xs font-mono break-all">{signedMessage.slice(0, 50)}...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Player Stats */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.gamesPlayed}</div>
              <div className="text-xs text-gray-400">Games</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.wins}</div>
              <div className="text-xs text-gray-400">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{stats.losses}</div>
              <div className="text-xs text-gray-400">Losses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.ties}</div>
              <div className="text-xs text-gray-400">Ties</div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Win Rate</span>
              <span className="text-cyan-400 font-semibold">{stats.winRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Total Earnings</span>
              <span className="text-green-400 font-semibold">{stats.totalEarnings.toFixed(4)} ETH</span>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="space-y-2">
            <h4 className="text-white text-sm font-medium">Achievements</h4>
            <div className="flex flex-wrap gap-1">
              {stats.gamesPlayed >= 1 && (
                <Badge className="bg-blue-500/20 border-blue-500/50 text-blue-300 text-xs">
                  <Target className="h-3 w-3 mr-1" />
                  First Game
                </Badge>
              )}
              {stats.wins >= 1 && (
                <Badge className="bg-green-500/20 border-green-500/50 text-green-300 text-xs">
                  <Trophy className="h-3 w-3 mr-1" />
                  First Win
                </Badge>
              )}
              {stats.wins >= 5 && (
                <Badge className="bg-purple-500/20 border-purple-500/50 text-purple-300 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Win Streak
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
