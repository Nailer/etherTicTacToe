// 🔍 GOLDSKY INTEGRATION - Main client file
console.log("🚀 Goldsky integration loaded!")

// Goldsky integration for real-time game data
interface GoldskyConfig {
  apiKey: string
  endpoint: string
}

const config: GoldskyConfig = {
  apiKey: import.meta.env.VITE_GOLDSKY_API_KEY || process.env.GOLDSKY_API_KEY || "demo-api-key",
  endpoint: "https://api.goldsky.com/api/public/project_your-project-id/subgraphs/tictactoe/1.0.0/gn",
}

// GraphQL queries for game data
export const GET_PLAYER_GAMES = `
  query GetPlayerGames($player: String!, $first: Int = 10) {
    games(
      where: { 
        or: [
          { player1: $player },
          { player2: $player }
        ]
      }
      orderBy: createdAt
      orderDirection: desc
      first: $first
    ) {
      id
      player1
      player2
      winner
      betAmount
      createdAt
      isActive
      moves {
        id
        player
        position
        timestamp
        blockNumber
      }
    }
  }
`

export const GET_LEADERBOARD = `
  query GetLeaderboard($first: Int = 10) {
    players(
      orderBy: totalWinnings
      orderDirection: desc
      first: $first
      where: { gamesPlayed_gt: 0 }
    ) {
      id
      gamesWon
      gamesPlayed
      gamesLost
      gamesTied
      totalWinnings
      totalStaked
      winRate
      lastGameAt
      createdAt
    }
  }
`

export const GET_RECENT_MOVES = `
  query GetRecentMoves($first: Int = 20) {
    moves(
      orderBy: timestamp
      orderDirection: desc
      first: $first
    ) {
      id
      player
      position
      timestamp
      blockNumber
      game {
        id
        player1
        player2
        betAmount
        isActive
      }
    }
  }
`

export const GET_GAME_DETAILS = `
  query GetGameDetails($gameId: String!) {
    game(id: $gameId) {
      id
      player1
      player2
      currentPlayer
      winner
      betAmount
      isActive
      createdAt
      endedAt
      moves {
        id
        player
        position
        timestamp
        blockNumber
      }
    }
  }
`

export const GET_PLAYER_STATS = `
  query GetPlayerStats($player: String!) {
    player(id: $player) {
      id
      gamesWon
      gamesPlayed
      gamesLost
      gamesTied
      totalWinnings
      totalStaked
      winRate
      longestWinStreak
      currentWinStreak
      lastGameAt
      createdAt
      recentGames: games(
        orderBy: createdAt
        orderDirection: desc
        first: 5
      ) {
        id
        winner
        betAmount
        createdAt
        opponent: player1 # This would need logic to determine opponent
      }
    }
  }
`

export const SUBSCRIBE_TO_GAMES = `
  subscription GameUpdates {
    games(
      orderBy: createdAt
      orderDirection: desc
      first: 10
    ) {
      id
      player1
      player2
      currentPlayer
      winner
      betAmount
      isActive
      createdAt
      moves {
        id
        player
        position
        timestamp
      }
    }
  }
`

export const SUBSCRIBE_TO_MOVES = `
  subscription MoveUpdates {
    moves(
      orderBy: timestamp
      orderDirection: desc
      first: 20
    ) {
      id
      player
      position
      timestamp
      game {
        id
        player1
        player2
        betAmount
        isActive
      }
    }
  }
`

// API client class
class GoldskyClient {
  private config: GoldskyConfig

  constructor(config: GoldskyConfig) {
    this.config = config
  }

  async query(query: string, variables: Record<string, any> = {}) {
    try {
      const response = await fetch(this.config.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`)
      }

      return result.data
    } catch (error) {
      console.error("Goldsky query error:", error)
      // Return mock data for demo
      return this.getMockData(query, variables)
    }
  }

  // Mock data for demo purposes
  private getMockData(query: string, variables: Record<string, any>) {
    if (query.includes("GetPlayerGames")) {
      return {
        games: [
          {
            id: "game_1",
            player1: variables.player,
            player2: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
            winner: variables.player,
            betAmount: "0.01",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            isActive: false,
            moves: [
              { id: "move_1", player: variables.player, position: 0, timestamp: new Date().toISOString() },
              {
                id: "move_2",
                player: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
                position: 1,
                timestamp: new Date().toISOString(),
              },
            ],
          },
          {
            id: "game_2",
            player1: "0x8ba1f109551bD432803012645Hac136c22C177ec",
            player2: variables.player,
            winner: null,
            betAmount: "0.005",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            isActive: false,
            moves: [],
          },
        ],
      }
    }

    if (query.includes("GetLeaderboard")) {
      return {
        players: [
          {
            id: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
            gamesWon: 15,
            gamesPlayed: 20,
            gamesLost: 4,
            gamesTied: 1,
            totalWinnings: "0.245",
            totalStaked: "0.180",
            winRate: 75,
            lastGameAt: new Date().toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          },
          {
            id: "0x8ba1f109551bD432803012645Hac136c22C177ec",
            gamesWon: 12,
            gamesPlayed: 18,
            gamesLost: 5,
            gamesTied: 1,
            totalWinnings: "0.189",
            totalStaked: "0.150",
            winRate: 67,
            lastGameAt: new Date().toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          },
          {
            id: variables.player || "0x1234567890123456789012345678901234567890",
            gamesWon: 8,
            gamesPlayed: 12,
            gamesLost: 3,
            gamesTied: 1,
            totalWinnings: "0.125",
            totalStaked: "0.100",
            winRate: 67,
            lastGameAt: new Date().toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          },
        ],
      }
    }

    if (query.includes("GetRecentMoves")) {
      return {
        moves: [
          {
            id: "move_latest_1",
            player: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
            position: 4,
            timestamp: new Date(Date.now() - 30000).toISOString(),
            blockNumber: 12345678,
            game: {
              id: "game_active_1",
              player1: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
              player2: "0x8ba1f109551bD432803012645Hac136c22C177ec",
              betAmount: "0.02",
              isActive: true,
            },
          },
          {
            id: "move_latest_2",
            player: "0x8ba1f109551bD432803012645Hac136c22C177ec",
            position: 0,
            timestamp: new Date(Date.now() - 60000).toISOString(),
            blockNumber: 12345677,
            game: {
              id: "game_active_1",
              player1: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
              player2: "0x8ba1f109551bD432803012645Hac136c22C177ec",
              betAmount: "0.02",
              isActive: true,
            },
          },
        ],
      }
    }

    return {}
  }

  // Simulate subscription for demo
  subscribe(query: string, variables: Record<string, any> = {}, callback: (data: any) => void) {
    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      const mockData = this.getMockData(query, variables)
      callback(mockData)
    }, 10000)

    return () => clearInterval(interval)
  }
}

// Export client instance
export const goldskyClient = new GoldskyClient(config)

// Helper functions
export async function getPlayerGames(playerAddress: string, limit = 10) {
  const data = await goldskyClient.query(GET_PLAYER_GAMES, {
    player: playerAddress.toLowerCase(),
    first: limit,
  })
  return data.games || []
}

export async function getLeaderboard(limit = 10) {
  const data = await goldskyClient.query(GET_LEADERBOARD, { first: limit })
  return data.players || []
}

export async function getRecentMoves(limit = 20) {
  const data = await goldskyClient.query(GET_RECENT_MOVES, { first: limit })
  return data.moves || []
}

export async function getGameDetails(gameId: string) {
  const data = await goldskyClient.query(GET_GAME_DETAILS, { gameId })
  return data.game
}

export async function getPlayerStats(playerAddress: string) {
  const data = await goldskyClient.query(GET_PLAYER_STATS, {
    player: playerAddress.toLowerCase(),
  })
  return data.player
}

export function subscribeToGames(callback: (data: any) => void) {
  return goldskyClient.subscribe(SUBSCRIBE_TO_GAMES, {}, callback)
}

export function subscribeToMoves(callback: (data: any) => void) {
  return goldskyClient.subscribe(SUBSCRIBE_TO_MOVES, {}, callback)
}
