"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Vote, Users, BarChart3, Lock, Eye, ArrowLeft } from "lucide-react"
// Fixed import paths to use correct blockchain library location
import type { Voter } from "@/lib/blockchain"
import { blockchainSystem } from "@/lib/blockchain"
import VotingInterface from "@/components/voting-interface"
import AdminInterface from "@/components/admin-interface"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DemoGuide from "@/components/demo-guide"

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"home" | "voter" | "admin" | "voting" | "demo">("home")
  const [authenticatedVoter, setAuthenticatedVoter] = useState<Voter | null>(null)

  const handleVoterAuthenticated = (voter: Voter) => {
    setAuthenticatedVoter(voter)
    setCurrentView("voting")
  }

  if (currentView === "voter") {
    return <VoterAuthentication onAuthenticated={handleVoterAuthenticated} onBack={() => setCurrentView("home")} />
  }

  if (currentView === "voting") {
    return <VotingInterface voter={authenticatedVoter!} onBack={() => setCurrentView("home")} />
  }

  if (currentView === "admin") {
    return <AdminInterface onBack={() => setCurrentView("home")} />
  }

  if (currentView === "demo") {
    return <DemoGuide onBack={() => setCurrentView("home")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">भारत डिजिटल मतदान प्रणाली</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">India Digital Voting System</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Secure, transparent, and verifiable blockchain-based voting system with end-to-end encryption
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Lock className="h-3 w-3 mr-1" />
              Encrypted
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Shield className="h-3 w-3 mr-1" />
              Blockchain Secured
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Eye className="h-3 w-3 mr-1" />
              Auditable
            </Badge>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView("voter")}>
            <CardHeader className="text-center">
              <Vote className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">मतदाता पोर्टल / Voter Portal</CardTitle>
              <CardDescription>Cast your vote securely with EPIC ID authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                Enter Voting Portal
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView("admin")}>
            <CardHeader className="text-center">
              <Users className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-xl">प्रशासक पैनल / Admin Panel</CardTitle>
              <CardDescription>Manage elections, monitor votes, and publish results</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline" size="lg">
                Admin Access
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button
            onClick={() => setCurrentView("demo")}
            variant="outline"
            size="lg"
            className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
          >
            📋 View Demo Guide & Credentials
          </Button>
        </div>

        {/* System Features */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">System Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Blockchain Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Hyperledger Fabric-based permissioned blockchain ensures vote integrity and immutability
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">End-to-End Encryption</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Homomorphic encryption and zero-knowledge proofs protect voter privacy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Transparent Auditing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Public audit logs and cryptographic proofs enable independent verification
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function VoterAuthentication({
  onAuthenticated,
  onBack,
}: { onAuthenticated: (voter: Voter) => void; onBack: () => void }) {
  const [step, setStep] = useState<"epic" | "otp" | "pin">("epic")
  const [epicId, setEpicId] = useState("")
  const [otp, setOtp] = useState("")
  const [pin, setPin] = useState("")
  const [currentVoter, setCurrentVoter] = useState<Voter | null>(null)
  const [error, setError] = useState("")

  const handleEpicSubmit = () => {
    // Use blockchain system to get voter
    const voter = blockchainSystem.getVoter(epicId)
    if (voter) {
      setCurrentVoter(voter)
      setStep("otp")
      setError("")
    } else {
      setError("EPIC ID not found")
    }
  }

  const handleOtpSubmit = () => {
    if (currentVoter && otp === currentVoter.otp) {
      setStep("pin")
      setError("")
    } else {
      setError("Invalid OTP")
    }
  }

  const handlePinSubmit = () => {
    if (currentVoter && pin === currentVoter.pin) {
      onAuthenticated({ ...currentVoter, isAuthenticated: true })
    } else {
      setError("Invalid PIN")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-md mx-auto">
        <Button onClick={onBack} variant="outline" className="mb-6 bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle>Voter Authentication</CardTitle>
            <CardDescription>
              {step === "epic" && "Enter your EPIC ID"}
              {step === "otp" && "Enter OTP sent to your registered mobile"}
              {step === "pin" && "Enter your secure PIN"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === "epic" && (
              <>
                <div>
                  <Label htmlFor="epic">EPIC ID</Label>
                  <Input
                    id="epic"
                    value={epicId}
                    onChange={(e) => setEpicId(e.target.value)}
                    placeholder="Enter EPIC ID"
                  />
                </div>
                <Button onClick={handleEpicSubmit} className="w-full">
                  Verify EPIC ID
                </Button>
              </>
            )}

            {step === "otp" && (
              <>
                <div>
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                  />
                </div>
                <Button onClick={handleOtpSubmit} className="w-full">
                  Verify OTP
                </Button>
              </>
            )}

            {step === "pin" && (
              <>
                <div>
                  <Label htmlFor="pin">PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit PIN"
                    maxLength={4}
                  />
                </div>
                <Button onClick={handlePinSubmit} className="w-full">
                  Complete Authentication
                </Button>
              </>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                <strong>Demo Credentials:</strong>
                <br />
                Try EPIC ID: WBX1234567
                <br />
                OTP: 567890, PIN: 1234
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
