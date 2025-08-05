"use client"

import { Button } from "./ui/Button"
import { Badge } from "./ui/Badge"
import { Wallet, GamepadIcon, User } from "lucide-react"

interface SequenceUser {
  sub: string
  email?: string
  name?: string
  picture?: string
  email_verified?: boolean
}

interface HeaderProps {
  isConnected: boolean
  address?: string | null
  user?: SequenceUser | null
  onConnect: () => void
  onDisconnect: () => void
}

export function Header({ isConnected, address, user, onConnect, onDisconnect }: HeaderProps) {
  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GamepadIcon className="h-8 w-8 text-white" />
          <span className="text-2xl font-bold text-white">EtherTicTac</span>
          <Badge className="bg-purple-500/20 border-purple-500/50 text-purple-300 text-xs">Powered by Sequence</Badge>
        </div>

        <div className="flex items-center space-x-4">
          {isConnected ? (
            <div className="flex items-center space-x-3">
              {/* User Avatar */}
              <div className="flex items-center space-x-2">
                {user?.picture ? (
                  <img
                    src={user.picture || "/placeholder.svg"}
                    alt={user.name || "User"}
                    className="w-8 h-8 rounded-full border-2 border-green-500"
                  />
                ) : (
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500">
                    <User className="h-4 w-4 text-green-400" />
                  </div>
                )}
                <div className="text-left">
                  <p className="text-white text-sm font-medium">{user?.name || "Anonymous"}</p>
                  <p className="text-gray-400 text-xs">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
              </div>

              <Badge variant="outline" className="bg-green-500/20 border-green-500/50 text-green-300">
                <Wallet className="h-3 w-3 mr-1" />
                Connected
              </Badge>

              <Button
                variant="outline"
                size="sm"
                onClick={onDisconnect}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              onClick={onConnect}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Sign In with Sequence
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}
