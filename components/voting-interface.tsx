"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Vote, ArrowLeft, Copy, Shield, Lock } from "lucide-react"
import type { Voter } from "@/lib/blockchain"
import { blockchainSystem } from "@/lib/blockchain"

interface VotingInterfaceProps {
  voter: Voter
  onBack: () => void
}

export default function VotingInterface({ voter, onBack }: VotingInterfaceProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<string>("")
  const [hasVoted, setHasVoted] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const election = blockchainSystem.getElection()

  const handleVoteSubmit = async () => {
    if (!selectedCandidate) return

    setIsSubmitting(true)
    try {
      const response = await blockchainSystem.castVote(voter.id, selectedCandidate)

      if (response.success && response.transactionHash) {
        setTransactionHash(response.transactionHash)
        setHasVoted(true)
      } else {
        console.error("Vote submission failed:", response.error)
        // Could add error state here for user feedback
      }
    } catch (error) {
      console.error("Vote submission failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyTransactionHash = () => {
    navigator.clipboard.writeText(transactionHash)
  }

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200">
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-800">मतदान सफल / Vote Cast Successfully!</CardTitle>
              <CardDescription>Your vote has been securely recorded on the blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your vote is encrypted and anonymous. Keep your transaction hash for verification.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Transaction Hash:</h3>
                <div className="flex items-center gap-2">
                  <code className="bg-white p-2 rounded border flex-1 text-sm font-mono">{transactionHash}</code>
                  <Button size="sm" variant="outline" onClick={copyTransactionHash}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  You can verify your vote anytime using the transaction hash above.
                </p>
                <Button onClick={onBack} className="w-full">
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline" className="mb-6 bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Voter Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>मतदाता जानकारी / Voter Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Name:</strong> {voter.name}
                </p>
                <p>
                  <strong>EPIC ID:</strong> {voter.epicId}
                </p>
                <p>
                  <strong>Age:</strong> {voter.age}
                </p>
              </div>
              <div>
                <p>
                  <strong>State:</strong> {voter.state}
                </p>
                <p>
                  <strong>Constituency:</strong> {voter.constituency}
                </p>
                <Badge variant="secondary" className="mt-2">
                  <Shield className="h-3 w-3 mr-1" />
                  Authenticated
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Election Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5" />
              {election.name}
            </CardTitle>
            <CardDescription>Select your preferred candidate</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                <strong>Demo Credentials:</strong>
                <br />
                Try any EPIC ID from: WBX1234567, GJA7654321, MHA9876543, TNQ6543219, RJM5432167
                <br />
                Each has their respective OTP and PIN (check the demo data)
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              {election.candidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  className={`cursor-pointer transition-all ${
                    selectedCandidate === candidate.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedCandidate(candidate.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{candidate.symbol}</div>
                        <div>
                          <h3 className="font-semibold">{candidate.name}</h3>
                          <p className="text-sm text-gray-600">{candidate.party}</p>
                        </div>
                      </div>
                      {selectedCandidate === candidate.id && <CheckCircle className="h-6 w-6 text-blue-600" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button
                onClick={handleVoteSubmit}
                disabled={!selectedCandidate || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? "Submitting Vote..." : "Cast Vote"}
              </Button>
              {selectedCandidate && (
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Your vote will be encrypted and recorded on the blockchain
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
