"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, GamepadIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/hooks/use-wallet"
import { useGame } from "@/hooks/use-game"
import { GameControls } from "@/components/game-controls"
import { GameStats } from "@/components/game-stats"
import { StakeManager } from "@/components/stake-manager"
import { AIDifficulty } from "@/components/ai-difficulty"

type Player = "X" | "O" | null

export default function GamePage() {
  const { isConnected, address, connect, disconnect } = useWallet()
  const {
    board,
    currentPlayer,
    winner,
    gameStatus,
    stakeAmount,
    isAIThinking,
    makeMove,
    startGame,
    resetGame,
    setStake,
    getPayout,
  } = useGame()

  const renderSquare = (index: number) => {
    const value = board[index]
    const canMove = !value && !winner && gameStatus === "playing" && currentPlayer === "X" && !isAIThinking

    return (
      <button
        key={index}
        className={`
          aspect-square bg-white/10 backdrop-blur-lg rounded-lg 
          flex items-center justify-center text-4xl font-bold 
          border-2 transition-all duration-200
          ${
            canMove
              ? "border-white/40 hover:border-white/60 hover:bg-white/20 cursor-pointer hover:scale-105"
              : "border-white/20 cursor-not-allowed opacity-75"
          }
          ${winner && "opacity-50"}
        `}
        onClick={() => makeMove(index)}
        disabled={!canMove}
      >
        <span className={`${value === "X" ? "text-cyan-400" : "text-purple-400"} transition-all duration-300`}>
          {value}
        </span>
      </button>
    )
  }

  const getStatusMessage = () => {
    if (winner) {
      if (winner === "tie") return "Game ended in a tie!"
      if (winner === "X") return "You beat the AI! 🎉"
      return "AI wins this round!"
    }

    if (gameStatus === "playing") {
      if (isAIThinking) return "AI is thinking..."
      if (currentPlayer === "X") return "Your turn - click any empty square"
      return "AI's turn"
    }

    if (stakeAmount === 0) return "Set your stake amount to start playing"
    return "Click Start Game to challenge the AI"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <GamepadIcon className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">EtherTicTac</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-green-500/20 border-green-500/50 text-green-300">
                  <Wallet className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
                <span className="text-white text-sm">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnect}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={connect}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {!isConnected ? (
            /* Wallet Connection Required */
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-center">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Connect Your Wallet</CardTitle>
                <CardDescription className="text-gray-300">
                  Connect your Etherlink-compatible wallet to stake and play Tic-Tac-Toe against AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={connect}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Game Board */}
              <div className="lg:col-span-2">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-2xl">Tic-Tac-Toe vs AI</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={`${
                            gameStatus === "playing"
                              ? "bg-green-500/20 border-green-500/50 text-green-300"
                              : gameStatus === "finished"
                                ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                                : "bg-gray-500/20 border-gray-500/50 text-gray-300"
                          }`}
                        >
                          {gameStatus === "playing" ? "Playing" : gameStatus === "finished" ? "Finished" : "Ready"}
                        </Badge>
                        {isAIThinking && (
                          <Badge className="bg-purple-500/20 border-purple-500/50 text-purple-300">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            AI Thinking
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="text-gray-300">{getStatusMessage()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
                      {board.map((_, index) => renderSquare(index))}
                    </div>

                    {gameStatus === "idle" && stakeAmount === 0 && (
                      <div className="text-center">
                        <p className="text-gray-400 text-sm mb-4">
                          Set your stake amount and challenge the AI to win rewards!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stake Manager */}
                <StakeManager
                  onStakeSet={setStake}
                  currentStake={stakeAmount}
                  gameStatus={gameStatus}
                  isConnected={isConnected}
                />

                {/* AI Difficulty */}
                <AIDifficulty />

                {/* Game Controls */}
                <GameControls
                  gameStatus={gameStatus}
                  winner={winner}
                  stakeAmount={stakeAmount}
                  payout={getPayout()}
                  onStartGame={startGame}
                  onResetGame={resetGame}
                />

                {/* Game Status */}
                <GameStats currentPlayer={currentPlayer} gameStatus={gameStatus} winner={winner} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
