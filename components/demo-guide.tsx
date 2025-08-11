"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Shield, Copy, CheckCircle } from "lucide-react"
import { useState } from "react"
import { DEMO_ADMIN } from "@/lib/blockchain"

interface DemoUser {
  name: string
  epicId: string
  age: number
  state: string
  constituency: string
  pin: string
  otp: string
}

const DEMO_USERS: DemoUser[] = [
  {
    name: "Rajesh Kumar Sharma",
    epicId: "WBX1234567",
    age: 34,
    state: "West Bengal",
    constituency: "Kolkata Dakshin",
    pin: "1234",
    otp: "567890",
  },
  {
    name: "Anjali Mehta",
    epicId: "GJA7654321",
    age: 29,
    state: "Gujarat",
    constituency: "Ahmedabad East",
    pin: "5678",
    otp: "456789",
  },
  {
    name: "Mohammed Irfan Khan",
    epicId: "MHA9876543",
    age: 41,
    state: "Maharashtra",
    constituency: "Mumbai South",
    pin: "2468",
    otp: "345678",
  },
  {
    name: "Priya Ramesh Iyer",
    epicId: "TNQ6543219",
    age: 38,
    state: "Tamil Nadu",
    constituency: "Chennai Central",
    pin: "1357",
    otp: "234567",
  },
  {
    name: "Arjun Singh Rathore",
    epicId: "RJM5432167",
    age: 25,
    state: "Rajasthan",
    constituency: "Jaipur",
    pin: "9876",
    otp: "123456",
  },
]

export default function DemoGuide({ onClose }: { onClose: () => void }) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Demo Guide</h1>
            <p className="text-gray-600">Complete credentials for testing the blockchain voting system</p>
          </div>
          <Button onClick={onClose} variant="outline">
            Back to System
          </Button>
        </div>

        {/* Quick Start Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">For Voters:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Click "Voter Portal" on the homepage</li>
                  <li>Enter any EPIC ID from the demo users below</li>
                  <li>Enter the corresponding OTP when prompted</li>
                  <li>Enter the corresponding PIN to complete authentication</li>
                  <li>Select a candidate and cast your vote</li>
                  <li>Save your transaction receipt for verification</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">For Administrators:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  <li>Click "Admin Panel" on the homepage</li>
                  <li>Use admin credentials: admin_demo / Secure@2025</li>
                  <li>Start the election from the Election Control tab</li>
                  <li>Monitor votes in real-time from Vote Monitoring</li>
                  <li>View results and publish tallies from Results tab</li>
                  <li>Access audit logs from the Audit Trail tab</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Credentials */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Admin Credentials
            </CardTitle>
            <CardDescription>Use these credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <div className="flex items-center mt-1">
                    <code className="bg-white px-3 py-2 rounded border flex-1">{DEMO_ADMIN.username}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2 bg-transparent"
                      onClick={() => copyToClipboard(DEMO_ADMIN.username, "admin-username")}
                    >
                      {copiedField === "admin-username" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="flex items-center mt-1">
                    <code className="bg-white px-3 py-2 rounded border flex-1">{DEMO_ADMIN.password}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-2 bg-transparent"
                      onClick={() => copyToClipboard(DEMO_ADMIN.password, "admin-password")}
                    >
                      {copiedField === "admin-password" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Voters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-600" />
              Demo Voter Credentials
            </CardTitle>
            <CardDescription>Use any of these voter profiles to test the voting system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {DEMO_USERS.map((user, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg">{user.name}</h4>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{user.state}</Badge>
                      <Badge variant="outline">Age {user.age}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{user.constituency}</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">EPIC ID</label>
                      <div className="flex items-center mt-1">
                        <code className="bg-white px-3 py-2 rounded border flex-1 text-sm">{user.epicId}</code>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-2 bg-transparent"
                          onClick={() => copyToClipboard(user.epicId, `epic-${index}`)}
                        >
                          {copiedField === `epic-${index}` ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">OTP</label>
                      <div className="flex items-center mt-1">
                        <code className="bg-white px-3 py-2 rounded border flex-1 text-sm">{user.otp}</code>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-2 bg-transparent"
                          onClick={() => copyToClipboard(user.otp, `otp-${index}`)}
                        >
                          {copiedField === `otp-${index}` ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">PIN</label>
                      <div className="flex items-center mt-1">
                        <code className="bg-white px-3 py-2 rounded border flex-1 text-sm">{user.pin}</code>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-2 bg-transparent"
                          onClick={() => copyToClipboard(user.pin, `pin-${index}`)}
                        >
                          {copiedField === `pin-${index}` ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
