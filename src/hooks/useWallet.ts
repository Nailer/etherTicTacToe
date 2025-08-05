"use client"

import { useAddress, useConnect, useDisconnect, useConnectionStatus } from "@thirdweb-dev/react"
import { useEffect } from "react"

export function useWallet() {
  const address = useAddress()
  const connect = useConnect()
  const disconnect = useDisconnect()
  const connectionStatus = useConnectionStatus()

  const isConnected = connectionStatus === "connected"
  const isConnecting = connectionStatus === "connecting"

  const handleConnect = async () => {
    try {
      // The ConnectWallet component handles the connection
      // This function can be used for programmatic connections if needed
      console.log("Connect wallet triggered")
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  // Log connection status changes
  useEffect(() => {
    console.log("Connection status:", connectionStatus)
    if (address) {
      console.log("Connected address:", address)
    }
  }, [connectionStatus, address])

  return {
    isConnected,
    isConnecting,
    address,
    connect: handleConnect,
    disconnect: handleDisconnect,
    connectionStatus,
  }
}
