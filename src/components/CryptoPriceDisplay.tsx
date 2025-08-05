"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { DollarSign, Loader2, AlertCircle, Clock } from "lucide-react"
import { Badge } from "./ui/Badge"

export function CryptoPriceDisplay() {
  const [ethPrice, setEthPrice] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const fetchEthPrice = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // RedStone's public data stream for ETH/USD
      // Using the 'redstone' provider for simplicity.
      // For production, consider RedStone Core for on-chain data delivery.
      const response = await fetch("https://api.redstone.finance/prices?symbols=ETH&provider=redstone")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      if (data && data.ETH && data.ETH.value) {
        setEthPrice(data.ETH.value)
        setLastUpdated(new Date().toLocaleTimeString())
      } else {
        throw new Error("ETH price data not found in RedStone response.")
      }
    } catch (err) {
      console.error("Failed to fetch ETH price from RedStone:", err)
      setError("Failed to load ETH price. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEthPrice() // Initial fetch

    const interval = setInterval(fetchEthPrice, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval) // Cleanup on unmount
  }, [fetchEthPrice])

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Current ETH Price
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-400 mr-2" />
            <span className="text-gray-300">Loading price...</span>
          </div>
        ) : error ? (
          <div className="flex items-center text-red-400 text-sm justify-center py-4">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-1">ETH/USD</p>
            <p className="text-white text-4xl font-bold tabular-nums">${ethPrice?.toFixed(2)}</p>
            {lastUpdated && (
              <Badge variant="outline" className="bg-white/10 border-white/20 text-gray-400 text-xs mt-2">
                <Clock className="h-3 w-3 mr-1" />
                Last updated: {lastUpdated}
              </Badge>
            )}
          </div>
        )}
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
          <h4 className="text-white text-sm font-medium mb-2">Powered by RedStone Oracles</h4>
          <p className="text-xs text-gray-300">
            Real-time price data fetched directly from the RedStone network, ensuring accuracy and reliability.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
