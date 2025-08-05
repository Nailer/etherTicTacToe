"use client"

import { Button } from "./ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card"
import { Shield, Zap, Users, Gamepad2, Loader2 } from "lucide-react"

interface WalletConnectionProps {
  onConnect: () => void
  isLoading: boolean
}

export function WalletConnection({ onConnect, isLoading }: WalletConnectionProps) {
  const socialProviders = [
    { id: "google", name: "Google", icon: "🔍", color: "from-red-500 to-orange-500" },
    { id: "apple", name: "Apple", icon: "🍎", color: "from-gray-800 to-black" },
    { id: "discord", name: "Discord", icon: "🎮", color: "from-indigo-500 to-purple-500" },
    { id: "facebook", name: "Facebook", icon: "📘", color: "from-blue-500 to-blue-600" },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-center mb-8">
        <CardHeader>
          <CardTitle className="text-white text-3xl mb-2">Welcome to EtherTicTac</CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Sign in with your social account to start playing blockchain Tic-Tac-Toe with gasless transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Google Sign In */}
          <div className="flex justify-center">
            <Button
              onClick={onConnect}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold px-12 py-4 text-lg rounded-lg shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <span className="text-xl mr-3">🔍</span>
                  Continue with Google
                </>
              )}
            </Button>
          </div>

          {/* Alternative Social Logins */}
          <div className="space-y-3">
            <p className="text-gray-400 text-sm">Or choose another option:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {socialProviders.slice(1).map((provider) => (
                <Button
                  key={provider.id}
                  onClick={onConnect}
                  disabled={isLoading}
                  variant="outline"
                  className={`bg-gradient-to-r ${provider.color} border-0 text-white hover:opacity-90 transition-opacity`}
                >
                  <span className="mr-2">{provider.icon}</span>
                  {provider.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Sequence Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Social Login</h3>
              <p className="text-gray-400 text-sm">
                Sign in with Google, Apple, Discord, or Facebook. No seed phrases needed!
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Gasless Transactions</h3>
              <p className="text-gray-400 text-sm">
                Play without worrying about gas fees. We sponsor your transactions!
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gamepad2 className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Gaming Optimized</h3>
              <p className="text-gray-400 text-sm">Built for gaming with instant transactions and seamless UX.</p>
            </div>
          </div>

          {/* Why Sequence */}
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg p-6 mt-8">
            <h4 className="text-white font-semibold mb-4 text-center">Powered by Sequence</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Enterprise-grade security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>Instant wallet creation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span>Social recovery options</span>
              </div>
              <div className="flex items-center space-x-2">
                <Gamepad2 className="h-4 w-4 text-purple-400" />
                <span>Gaming-first design</span>
              </div>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mt-6">
            <p className="text-yellow-300 text-sm">
              <strong>Demo Mode:</strong> This demo uses simulated Sequence authentication. In production, you would
              configure your Sequence project keys for real social login.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
