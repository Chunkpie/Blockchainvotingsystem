"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Camera, Shield, User, Lock, Smartphone, CheckCircle, AlertCircle } from "lucide-react"
import { blockchainService, type Voter } from "@/lib/blockchain"

interface AuthenticationProps {
  onAuthenticated: (voter: Voter) => void
  onBack: () => void
}

type AuthStep = "epic" | "biometric" | "otp" | "authenticated"

export default function VoterAuthentication({ onAuthenticated, onBack }: AuthenticationProps) {
  const [currentStep, setCurrentStep] = useState<AuthStep>("epic")
  const [formData, setFormData] = useState({
    epicId: "",
    pin: "",
    otp: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [authenticatedVoter, setAuthenticatedVoter] = useState<Voter | null>(null)
  const [biometricCapture, setBiometricCapture] = useState<{
    faceDetected: boolean
    livenessVerified: boolean
  }>({
    faceDetected: false,
    livenessVerified: false,
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Handle EPIC ID validation
  const handleEpicSubmit = async () => {
    if (!formData.epicId || formData.epicId.length !== 10) {
      setError("Please enter a valid 10-digit EPIC ID")
      return
    }

    setError("")
    setCurrentStep("biometric")

    // Start camera for face liveness detection
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setError("Camera access required for biometric verification")
    }
  }

  // Simulate face liveness detection
  const handleBiometricVerification = useCallback(() => {
    setLoading(true)

    // Simulate face detection and liveness check
    setTimeout(() => {
      setBiometricCapture({
        faceDetected: true,
        livenessVerified: true,
      })
      setLoading(false)
      setCurrentStep("otp")

      // Stop camera
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }, 3000)
  }, [])

  // Handle OTP and PIN verification
  const handleFinalAuthentication = async () => {
    if (!formData.pin || !formData.otp) {
      setError("Please enter both PIN and OTP")
      return
    }

    setLoading(true)
    setError("")

    try {
      const voter = await blockchainService.authenticateVoter(formData.epicId, formData.pin, formData.otp)

      if (voter) {
        setAuthenticatedVoter(voter)
        setCurrentStep("authenticated")
        setTimeout(() => {
          onAuthenticated(voter)
        }, 2000)
      } else {
        setError("Invalid credentials. Please check your EPIC ID, PIN, and OTP.")
      }
    } catch (err) {
      setError("Authentication failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderEpicStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <CardTitle>EPIC ID Verification</CardTitle>
        <CardDescription>Enter your Electoral Photo Identity Card number</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="epicId">EPIC ID Number</Label>
          <Input
            id="epicId"
            placeholder="Enter 10-digit EPIC ID"
            value={formData.epicId}
            onChange={(e) => setFormData({ ...formData, epicId: e.target.value.toUpperCase() })}
            maxLength={10}
            className="text-center text-lg font-mono"
          />
        </div>

        {/* Demo credentials helper */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <div>WBX1234567 - Rajesh Kumar Sharma</div>
            <div>GJA7654321 - Anjali Mehta</div>
            <div>MHA9876543 - Mohammed Irfan Khan</div>
            <div>TNQ6543219 - Priya Ramesh Iyer</div>
            <div>RJM5432167 - Arjun Singh Rathore</div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button onClick={handleEpicSubmit} className="w-full" size="lg">
          Verify EPIC ID
        </Button>
      </CardContent>
    </Card>
  )

  const renderBiometricStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Camera className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <CardTitle>Face Liveness Detection</CardTitle>
        <CardDescription>Look directly at the camera for biometric verification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <video ref={videoRef} autoPlay muted className="w-full h-64 bg-gray-200 rounded-lg object-cover" />
          <canvas ref={canvasRef} className="hidden" />

          {loading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p>Detecting face...</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Face Detection</span>
            <Badge variant={biometricCapture.faceDetected ? "default" : "secondary"}>
              {biometricCapture.faceDetected ? "✓ Detected" : "Pending"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Liveness Check</span>
            <Badge variant={biometricCapture.livenessVerified ? "default" : "secondary"}>
              {biometricCapture.livenessVerified ? "✓ Verified" : "Pending"}
            </Badge>
          </div>
        </div>

        <Button onClick={handleBiometricVerification} className="w-full" size="lg" disabled={loading}>
          {loading ? "Verifying..." : "Start Verification"}
        </Button>
      </CardContent>
    </Card>
  )

  const renderOtpStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-purple-600 mr-2" />
          <Smartphone className="h-6 w-6 text-purple-600" />
        </div>
        <CardTitle>PIN & OTP Verification</CardTitle>
        <CardDescription>Enter your 4-digit PIN and 6-digit OTP</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="pin">4-Digit PIN</Label>
          <Input
            id="pin"
            type="password"
            placeholder="Enter PIN"
            value={formData.pin}
            onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
            maxLength={4}
            className="text-center text-lg font-mono"
          />
        </div>

        <div>
          <Label htmlFor="otp">6-Digit OTP</Label>
          <Input
            id="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
            maxLength={6}
            className="text-center text-lg font-mono"
          />
        </div>

        {/* Demo credentials helper */}
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-purple-800 mb-2">Demo Credentials for {formData.epicId}:</p>
          <div className="text-xs text-purple-700">
            {formData.epicId === "WBX1234567" && "PIN: 1234, OTP: 567890"}
            {formData.epicId === "GJA7654321" && "PIN: 5678, OTP: 456789"}
            {formData.epicId === "MHA9876543" && "PIN: 2468, OTP: 345678"}
            {formData.epicId === "TNQ6543219" && "PIN: 1357, OTP: 234567"}
            {formData.epicId === "RJM5432167" && "PIN: 9876, OTP: 123456"}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button onClick={handleFinalAuthentication} className="w-full" size="lg" disabled={loading}>
          {loading ? "Authenticating..." : "Complete Authentication"}
        </Button>
      </CardContent>
    </Card>
  )

  const renderAuthenticatedStep = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <CardTitle className="text-green-800">Authentication Successful</CardTitle>
        <CardDescription>Welcome, {authenticatedVoter?.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {authenticatedVoter && (
          <div className="bg-green-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{authenticatedVoter.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">EPIC ID:</span>
              <span className="font-mono">{authenticatedVoter.epicId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Constituency:</span>
              <span>{authenticatedVoter.constituency}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">State:</span>
              <span>{authenticatedVoter.state}</span>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-600">Redirecting to voting interface...</div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button onClick={onBack} variant="outline" className="absolute top-4 left-4 bg-transparent">
            ← Back to Home
          </Button>
          <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-900">Secure Voter Authentication</h1>
          <p className="text-gray-600">Multi-factor authentication for secure voting</p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center ${currentStep === "epic" ? "text-blue-600" : currentStep === "biometric" || currentStep === "otp" || currentStep === "authenticated" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "epic" ? "bg-blue-100" : currentStep === "biometric" || currentStep === "otp" || currentStep === "authenticated" ? "bg-green-100" : "bg-gray-100"}`}
              >
                1
              </div>
              <span className="ml-2 text-sm">EPIC ID</span>
            </div>
            <div
              className={`w-8 h-1 ${currentStep === "biometric" || currentStep === "otp" || currentStep === "authenticated" ? "bg-green-200" : "bg-gray-200"}`}
            ></div>
            <div
              className={`flex items-center ${currentStep === "biometric" ? "text-blue-600" : currentStep === "otp" || currentStep === "authenticated" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "biometric" ? "bg-blue-100" : currentStep === "otp" || currentStep === "authenticated" ? "bg-green-100" : "bg-gray-100"}`}
              >
                2
              </div>
              <span className="ml-2 text-sm">Biometric</span>
            </div>
            <div
              className={`w-8 h-1 ${currentStep === "otp" || currentStep === "authenticated" ? "bg-green-200" : "bg-gray-200"}`}
            ></div>
            <div
              className={`flex items-center ${currentStep === "otp" ? "text-blue-600" : currentStep === "authenticated" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === "otp" ? "bg-blue-100" : currentStep === "authenticated" ? "bg-green-100" : "bg-gray-100"}`}
              >
                3
              </div>
              <span className="ml-2 text-sm">PIN & OTP</span>
            </div>
          </div>
        </div>

        {/* Authentication steps */}
        {currentStep === "epic" && renderEpicStep()}
        {currentStep === "biometric" && renderBiometricStep()}
        {currentStep === "otp" && renderOtpStep()}
        {currentStep === "authenticated" && renderAuthenticatedStep()}
      </div>
    </div>
  )
}
