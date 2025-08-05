"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coins, DollarSign, AlertCircle } from "lucide-react"

interface StakeManagerProps {
  onStakeSet: (amount: number) => void
  currentStake: number
  gameStatus: string
  isConnected: boolean
}

export function StakeManager({ onStakeSet, currentStake, gameStatus, isConnected }: StakeManagerProps) {
  const [stakeAmount, setStakeAmount] = useState("")
  const [error, setError] = useState("")

  const handleStakeSubmit = () => {
    const amount = Number.parseFloat(stakeAmount)

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than 0")
      return
    }

    if (amount < 0.001) {
      setError("Minimum stake is 0.001 ETH")
      return
    }

    if (amount > 10) {
      setError("Maximum stake is 10 ETH")
      return
    }

    setError("")
    onStakeSet(amount)
    setStakeAmount("")
  }

  const presetAmounts = [0.001, 0.01, 0.1, 0.5, 1.0]

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Coins className="h-5 w-5 mr-2" />
          Stake Amount
        </CardTitle>
        <CardDescription className="text-gray-300">Set your stake amount to play against the AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentStake > 0 ? (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
            <DollarSign className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white mb-1">Stake Set</h3>
            <p className="text-green-300 text-xl font-bold">{currentStake} ETH</p>
            <p className="text-gray-300 text-sm mt-2">
              Win: +{(currentStake * 1.8).toFixed(4)} ETH | Lose: -{currentStake} ETH
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="stake" className="text-white">
                Enter Stake Amount (ETH)
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="stake"
                  type="number"
                  step="0.001"
                  min="0.001"
                  max="10"
                  placeholder="0.001"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  disabled={!isConnected || gameStatus === "playing"}
                />
                <Button
                  onClick={handleStakeSubmit}
                  disabled={!stakeAmount || !isConnected || gameStatus === "playing"}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  Set
                </Button>
              </div>
              {error && (
                <div className="flex items-center text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-white text-sm">Quick Select</Label>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setStakeAmount(amount.toString())}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                    disabled={!isConnected || gameStatus === "playing"}
                  >
                    {amount} ETH
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
              <h4 className="text-white text-sm font-medium mb-2">Payout Structure:</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <p>• Win vs AI: +80% of stake</p>
                <p>• Lose vs AI: -100% of stake</p>
                <p>• Tie: Stake returned</p>
                <p>• House edge: 10%</p>
              </div>
            </div>
          </>
        )}

        {!isConnected && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 text-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mx-auto mb-2" />
            <p className="text-yellow-300 text-sm">Connect wallet to set stake</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
