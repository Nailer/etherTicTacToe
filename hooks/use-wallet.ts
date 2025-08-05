"use client"

import { useState, useEffect } from "react"

declare global {
  interface Window {
    ethereum?: any
  }
}

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const connect = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask or another Ethereum wallet")
      return
    }

    setIsLoading(true)
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)

        // Try to switch to Etherlink network (you'll need to add the actual network details)
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x80A" }], // Etherlink Testnet chain ID (2058 in decimal)
          })
        } catch (switchError: any) {
          // If the network doesn't exist, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x80A",
                    chainName: "Etherlink Testnet",
                    nativeCurrency: {
                      name: "XTZ",
                      symbol: "XTZ",
                      decimals: 18,
                    },
                    rpcUrls: ["https://node.ghostnet.etherlink.com"],
                    blockExplorerUrls: ["https://testnet-explorer.etherlink.com"],
                  },
                ],
              })
            } catch (addError) {
              console.error("Error adding network:", addError)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
  }

  return {
    isConnected,
    address,
    isLoading,
    connect,
    disconnect,
  }
}
