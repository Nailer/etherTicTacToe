"use client"

import { useState, useEffect, useCallback } from "react"
import { SequenceWaaS } from "@0xsequence/waas"

interface SequenceUser {
  sub: string
  email?: string
  name?: string
  picture?: string
  email_verified?: boolean
}

interface WaasConfig {
  projectAccessKey: string
  waasConfigKey: string
  network: string
}

// Simulated user data for demo (in production, this comes from Sequence)
const DEMO_USERS = [
  {
    sub: "google_123456789",
    email: "john.doe@gmail.com",
    name: "John Doe",
    picture: "/placeholder.svg?height=100&width=100&text=JD",
    email_verified: true,
  },
  {
    sub: "google_987654321",
    email: "jane.smith@gmail.com",
    name: "Jane Smith",
    picture: "/placeholder.svg?height=100&width=100&text=JS",
    email_verified: true,
  },
  {
    sub: "apple_456789123",
    email: "alex.wilson@icloud.com",
    name: "Alex Wilson",
    picture: "/placeholder.svg?height=100&width=100&text=AW",
    email_verified: true,
  },
]

export function useSequenceWallet(config: WaasConfig) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [user, setUser] = useState<SequenceUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [waas, setWaas] = useState<SequenceWaaS | null>(null)

  // Check for existing session on load
  useEffect(() => {
    const savedSession = localStorage.getItem("sequence-demo-session")
    if (savedSession) {
      const sessionData = JSON.parse(savedSession)
      setUser(sessionData.user)
      setAddress(sessionData.address)
      setIsConnected(true)
    }
  }, [])

  // Initialize Sequence WaaS
  useEffect(() => {
    const initializeWaaS = async () => {
      try {
        const waasInstance = new SequenceWaaS({
          projectAccessKey: config.projectAccessKey,
          waasConfigKey: config.waasConfigKey,
          network: config.network,
        })

        setWaas(waasInstance)

        // Check if user is already logged in
        const session = await waasInstance.getIdToken()
        if (session) {
          const userInfo = await waasInstance.getUserInfo()
          const walletAddress = await waasInstance.getAddress()

          setUser(userInfo)
          setAddress(walletAddress)
          setIsConnected(true)
        }
      } catch (error) {
        console.error("Failed to initialize Sequence WaaS:", error)
      }
    }

    initializeWaaS()
  }, [config])

  const connect = useCallback(async () => {
    setIsLoading(true)

    try {
      // Simulate Google OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate network delay

      // In production, this would be:
      // const credentials = await waas.signIn({ idpHint: "google" })
      // const userInfo = await waas.getUserInfo()
      // const walletAddress = await waas.getAddress()

      // For demo, randomly select a user
      const randomUser = DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)]
      const walletAddress = `0x${Math.random().toString(16).substr(2, 40)}`

      // Save session
      const sessionData = {
        user: randomUser,
        address: walletAddress,
        timestamp: Date.now(),
      }
      localStorage.setItem("sequence-demo-session", JSON.stringify(sessionData))

      setUser(randomUser)
      setAddress(walletAddress)
      setIsConnected(true)

      console.log("✅ Sequence Authentication Success:", {
        user: randomUser,
        address: walletAddress,
      })
    } catch (error) {
      console.error("❌ Sequence Authentication Failed:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const disconnect = useCallback(async () => {
    try {
      // In production: await waas.signOut()
      localStorage.removeItem("sequence-demo-session")

      setUser(null)
      setAddress(null)
      setIsConnected(false)

      console.log("✅ Sequence Sign Out Success")
    } catch (error) {
      console.error("❌ Sequence Sign Out Failed:", error)
    }
  }, [])

  const signMessage = useCallback(
    async (message: string) => {
      if (!waas || !isConnected) return null

      try {
        // Simulate message signing
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // In production: const signature = await waas.signMessage({ message })
        const mockSignature = `0x${Math.random().toString(16).substr(2, 130)}`

        console.log("✅ Message Signed:", { message, signature: mockSignature })
        return mockSignature
      } catch (error) {
        console.error("❌ Message Signing Failed:", error)
        return null
      }
    },
    [waas, isConnected],
  )

  const sendTransaction = useCallback(
    async (transaction: any) => {
      if (!waas || !isConnected) return null

      try {
        // Simulate gasless transaction
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // In production: const txResponse = await waas.sendTransaction({ transactions: [transaction] })
        const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`

        console.log("✅ Gasless Transaction Sent:", { transaction, txHash: mockTxHash })
        return { hash: mockTxHash }
      } catch (error) {
        console.error("❌ Transaction Failed:", error)
        return null
      }
    },
    [waas, isConnected],
  )

  return {
    isConnected,
    address,
    user,
    isLoading,
    connect,
    disconnect,
    signMessage,
    sendTransaction,
    waas,
  }
}
