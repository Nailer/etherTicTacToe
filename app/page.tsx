import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GamepadIcon, Zap, Shield, Trophy } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GamepadIcon className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">EtherTicTac</span>
          </div>
          <Link href="/game">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Play Now
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Tic-Tac-Toe on
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Etherlink
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the classic game like never before. Play Tic-Tac-Toe on the Etherlink blockchain with provably
            fair gameplay and instant rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/game">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 text-lg"
              >
                Start Playing
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-3 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Game Preview */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Game Preview</h3>
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {Array.from({ length: 9 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-white/20 rounded-lg flex items-center justify-center text-2xl font-bold text-white border border-white/30"
                >
                  {i === 0 ? "X" : i === 4 ? "O" : i === 8 ? "X" : ""}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Why Play on Etherlink?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <Zap className="h-12 w-12 text-cyan-400 mb-4" />
              <CardTitle className="text-white">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Instant transactions and gameplay powered by Etherlink's high-performance blockchain infrastructure.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">Provably Fair</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Every move is recorded on-chain, ensuring transparent and verifiable gameplay for all players.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <Trophy className="h-12 w-12 text-yellow-400 mb-4" />
              <CardTitle className="text-white">Win Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Compete with other players and earn cryptocurrency rewards for your victories.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How to Play */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">How to Play</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold text-white">Connect Wallet</h3>
              <p className="text-gray-300">Connect your Etherlink-compatible wallet to start playing.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold text-white">Join Game</h3>
              <p className="text-gray-300">Create a new game or join an existing one with another player.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold text-white">Play & Win</h3>
              <p className="text-gray-300">Make your moves and win rewards on the blockchain!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Play?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of players already enjoying blockchain-powered Tic-Tac-Toe.
          </p>
          <Link href="/game">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-12 py-4 text-xl"
            >
              Play Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-black/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <GamepadIcon className="h-6 w-6 text-white" />
              <span className="text-lg font-semibold text-white">EtherTicTac</span>
            </div>
            <div className="text-gray-400 text-sm">© 2024 EtherTicTac. Built on Etherlink blockchain.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
