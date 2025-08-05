import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { Brain, Zap, Target } from "lucide-react"

export function AIDifficulty() {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          AI Opponent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Badge className="bg-red-500/20 border-red-500/50 text-red-300 text-lg px-4 py-2 mb-3">
            <Target className="h-4 w-4 mr-2" />
            HARD
          </Badge>
          <p className="text-gray-300 text-sm">You're playing against an advanced AI that uses strategic algorithms</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Strategy Level</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div key={level} className={`w-3 h-3 rounded-full ${level <= 5 ? "bg-red-500" : "bg-gray-600"}`} />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Response Time</span>
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
              <Zap className="h-3 w-3 mr-1" />
              Instant
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Win Rate</span>
            <span className="text-red-400 font-semibold">~85%</span>
          </div>
        </div>

        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
          <h4 className="text-white text-sm font-medium mb-2">AI Features:</h4>
          <div className="text-xs text-gray-300 space-y-1">
            <p>• Minimax algorithm with pruning</p>
            <p>• Perfect opening moves</p>
            <p>• Strategic blocking & winning</p>
            <p>• No random moves</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
