"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Users, BarChart3, Shield, Eye, Lock } from "lucide-react"
import { blockchainSystem, DEMO_ADMIN } from "@/lib/blockchain"

interface AdminInterfaceProps {
  onBack: () => void
}

export default function AdminInterface({ onBack }: AdminInterfaceProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [tally, setTally] = useState<Record<string, number>>({})

  const election = blockchainSystem.getElection()

  useEffect(() => {
    if (isAuthenticated) {
      loadTally()
    }
  }, [isAuthenticated])

  const loadTally = async () => {
    const currentTally = await blockchainSystem.getTally()
    setTally(currentTally)
  }

  const handleLogin = () => {
    if (username === DEMO_ADMIN.username && password === DEMO_ADMIN.password) {
      setIsAuthenticated(true)
      setLoginError("")
    } else {
      setLoginError("Invalid credentials")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
        <div className="max-w-md mx-auto">
          <Button onClick={onBack} variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Enter your administrator credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>

              {loginError && (
                <Alert variant="destructive">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Demo Credentials:</strong>
                  <br />
                  Username: admin_demo
                  <br />
                  Password: Secure@2025
                </AlertDescription>
              </Alert>

              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const totalVotes = Object.values(tally).reduce((sum, count) => sum + count, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <Badge variant="secondary">
            <Shield className="h-3 w-3 mr-1" />
            Admin Authenticated
          </Badge>
        </div>

        {/* Dashboard Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Election Status</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidates</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{election.candidates.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Election Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Election Management</CardTitle>
            <CardDescription>Control election status and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline" className="bg-green-50 border-green-200">
                Start Election
              </Button>
              <Button variant="outline" className="bg-red-50 border-red-200">
                End Election
              </Button>
              <Button variant="outline" onClick={loadTally}>
                Refresh Tally
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vote Tally */}
        <Card>
          <CardHeader>
            <CardTitle>Live Vote Tally</CardTitle>
            <CardDescription>Real-time encrypted vote counts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {election.candidates.map((candidate) => {
                const votes = tally[candidate.id] || 0
                const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0

                return (
                  <div key={candidate.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{candidate.symbol}</span>
                        <div>
                          <h3 className="font-semibold">{candidate.name}</h3>
                          <p className="text-sm text-gray-600">{candidate.party}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{votes}</div>
                        <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {totalVotes === 0 && (
              <Alert>
                <AlertDescription>
                  No votes have been cast yet. The tally will update in real-time as votes are submitted.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
