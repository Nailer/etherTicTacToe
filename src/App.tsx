"use client"
import { sequence } from "0xsequence"
import { Header } from "./components/Header"
// import { WalletConnection } from "./components/WalletConnection" // Removed WalletConnection import
import { GameBoard } from "./components/GameBoard"
import { StakeManager } from "./components/StakeManager"
import { AIDifficulty } from "./components/AIDifficulty"
import { GameControls } from "./components/GameControls"
import { GameStats } from "./components/GameStats"
import { PlayerProfile } from "./components/PlayerProfile"
import { GameHistory } from "./components/GameHistory"
import { Leaderboard } from "./components/Leaderboard"
import { RealTimeGameFeed } from "./components/RealTimeGameFeed"
import { PlayerAnalytics } from "./components/PlayerAnalytics"
import { CryptoPriceDisplay } from "./components/CryptoPriceDisplay"
import { useSequenceWallet } from "./hooks/useSequenceWallet"
import { useGame } from "./hooks/useGame"
import { useEffect } from "react"
import "./App.css"

// Sequence Configuration
const sequenceConfig = {
  projectAccessKey: import.meta.env.VITE_SEQUENCE_PROJECT_ACCESS_KEY || "demo-project-key",
  waasConfigKey: import.meta.env.VITE_SEQUENCE_WAAS_CONFIG_KEY || "demo-waas-key",
  network: "polygon",
}

// Hardcoded dummy address for Goldsky demo when not connected
const DEMO_PLAYER_ADDRESS = "0xDemoPlayerAddressForHackathon"

function App() {
  const { isConnected, address, user, isLoading, connect, disconnect, signMessage, sendTransaction } =
    useSequenceWallet(sequenceConfig)

  // Use the real address if connected, otherwise use the demo address for Goldsky components
  const currentAddress = isConnected ? address : DEMO_PLAYER_ADDRESS

  const {
    board,
    currentPlayer,
    winner,
    gameStatus,
    stakeAmount,
    isAIThinking,
    playerStats,
    makeMove,
    startGame,
    resetGame,
    setStake,
    getPayout,
  } = useGame(currentAddress) // Pass currentAddress to useGame

  // Initialize Sequence on app load
  useEffect(() => {
    sequence.initWallet("polygon", {
      projectAccessKey: sequenceConfig.projectAccessKey,
      defaultNetwork: "polygon",
    })
  }, [])

  // Dummy signMessage and sendTransaction for when not connected
  const dummySignMessage = async (message: string) => {
    alert("Please connect your wallet to sign messages.")
    console.warn("Attempted to sign message without wallet connection:", message)
    return null
  }

  const dummySendTransaction = async (transaction: any) => {
    alert("Please connect your wallet to send transactions.")
    console.warn("Attempted to send transaction without wallet connection:", transaction)
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header isConnected={isConnected} address={address} user={user} onConnect={connect} onDisconnect={disconnect} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Game Section - Always rendered */}
          <div className="space-y-6">
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Player Profile */}
              <div className="lg:col-span-1">
                <PlayerProfile
                  user={user}
                  address={address} // Pass actual address (null if not connected)
                  stats={playerStats}
                  onSignMessage={isConnected ? signMessage : dummySignMessage}
                />
              </div>

              {/* Game Board */}
              <div className="lg:col-span-2">
                <GameBoard
                  board={board}
                  winner={winner}
                  gameStatus={gameStatus}
                  currentPlayer={currentPlayer}
                  isAIThinking={isAIThinking}
                  stakeAmount={stakeAmount}
                  onMakeMove={makeMove}
                />
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-2 space-y-6">
                {/* RedStone Price Display */}
                <CryptoPriceDisplay />

                <StakeManager
                  onStakeSet={setStake}
                  currentStake={stakeAmount}
                  gameStatus={gameStatus}
                  isConnected={isConnected}
                  address={address} // Pass actual address (null if not connected)
                  onSendTransaction={isConnected ? sendTransaction : dummySendTransaction}
                />

                <AIDifficulty />

                <GameControls
                  gameStatus={gameStatus}
                  winner={winner}
                  stakeAmount={stakeAmount}
                  payout={getPayout()}
                  onStartGame={startGame}
                  onResetGame={resetGame}
                  onSendTransaction={isConnected ? sendTransaction : dummySendTransaction}
                />

                <GameStats
                  currentPlayer={currentPlayer}
                  gameStatus={gameStatus}
                  winner={winner}
                  playerStats={playerStats}
                />
              </div>
            </div>

            {/* Goldsky Data Section - Always visible for demo */}
            <div className="space-y-6 mt-8">
              <h2 className="text-3xl font-bold text-white text-center mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Live Blockchain Data
                </span>{" "}
                (Demo)
              </h2>
              <div className="grid lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <GameHistory playerAddress={currentAddress} />
                </div>
                <div className="lg:col-span-1">
                  <Leaderboard playerAddress={currentAddress} />
                </div>
                <div className="lg:col-span-1">
                  <RealTimeGameFeed />
                </div>
                <div className="lg:col-span-1">
                  <PlayerAnalytics playerAddress={currentAddress} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
