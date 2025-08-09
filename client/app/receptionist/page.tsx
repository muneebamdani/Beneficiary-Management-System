"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { UserPlus, Clock, CheckCircle, Users } from "lucide-react"

export default function ReceptionistPanel() {
  const [formData, setFormData] = useState({
    cnic: "",
    name: "",
    phone: "",
    address: "",
    purpose: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [tokens, setTokens] = useState([
    {
      id: 1,
      tokenNumber: "T001",
      name: "Ahmed Ali",
      cnic: "12345-1234567-1",
      status: "pending",
      createdAt: "2024-01-15 10:30",
    },
    {
      id: 2,
      tokenNumber: "T002",
      name: "Fatima Khan",
      cnic: "12345-1234567-2",
      status: "completed",
      createdAt: "2024-01-15 11:15",
    },
    {
      id: 3,
      tokenNumber: "T003",
      name: "Muhammad Hassan",
      cnic: "12345-1234567-3",
      status: "in-progress",
      createdAt: "2024-01-15 12:00",
    },
  ])

  const stats = [
    { title: "Today's Tokens", value: "23", icon: Users, color: "blue" },
    { title: "Registered Today", value: "18", icon: UserPlus, color: "green" },
    { title: "Pending", value: "8", icon: Clock, color: "yellow" },
    { title: "Completed", value: "15", icon: CheckCircle, color: "purple" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      // In real app, make API call to register beneficiary
      const newToken = {
        id: tokens.length + 1,
        tokenNumber: `T${String(tokens.length + 1).padStart(3, "0")}`,
        name: formData.name,
        cnic: formData.cnic,
        status: "pending",
        createdAt: new Date().toLocaleString(),
      }

      setTokens([newToken, ...tokens])
      setMessage(`Beneficiary registered successfully! Token Number: ${newToken.tokenNumber}`)
      setFormData({ cnic: "", name: "", phone: "", address: "", purpose: "" })
    } catch (error) {
      setMessage("Error registering beneficiary. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "default"
      case "in-progress":
        return "secondary"
      case "completed":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["receptionist"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Receptionist Panel</h1>
            <p className="text-muted-foreground">Register beneficiaries and manage tokens</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Registration Form */}
            <Card>
              <CardHeader>
                <CardTitle>Register Beneficiary</CardTitle>
                <CardDescription>Fill in the beneficiary details to generate a token</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {message && (
                    <Alert>
                      <AlertDescription>{message}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="cnic">CNIC</Label>
                    <Input
                      id="cnic"
                      name="cnic"
                      placeholder="12345-1234567-1"
                      value={formData.cnic}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="03XX-XXXXXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter complete address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose of Visit</Label>
                    <Textarea
                      id="purpose"
                      name="purpose"
                      placeholder="Describe the purpose of visit"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Registering..." : "Register Beneficiary"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Tokens */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Tokens</CardTitle>
                <CardDescription>Latest registered beneficiaries and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tokens.slice(0, 5).map((token) => (
                    <div key={token.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{token.tokenNumber}</p>
                        <p className="text-sm text-muted-foreground">{token.name}</p>
                        <p className="text-xs text-muted-foreground">{token.createdAt}</p>
                      </div>
                      <Badge variant={getStatusColor(token.status)}>{token.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All Tokens Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Tokens</CardTitle>
              <CardDescription>Complete list of registered beneficiaries</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>CNIC</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">{token.tokenNumber}</TableCell>
                      <TableCell>{token.name}</TableCell>
                      <TableCell>{token.cnic}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(token.status)}>{token.status}</Badge>
                      </TableCell>
                      <TableCell>{token.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
