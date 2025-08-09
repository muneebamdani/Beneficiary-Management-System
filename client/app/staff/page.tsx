"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatsCard } from "@/components/stats-card"
import { Search, Clock, CheckCircle, XCircle, Users } from "lucide-react"

export default function StaffPanel() {
  const [searchToken, setSearchToken] = useState("")
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null)
  const [status, setStatus] = useState("")
  const [remarks, setRemarks] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  // Mock data - in real app, this would come from API
  const beneficiaries = [
    {
      id: 1,
      tokenNumber: "T001",
      name: "Ahmed Ali",
      cnic: "12345-1234567-1",
      phone: "0300-1234567",
      address: "123 Main Street, Karachi",
      purpose: "Financial assistance application",
      status: "pending",
      remarks: "",
      createdAt: "2024-01-15 10:30",
    },
    {
      id: 2,
      tokenNumber: "T002",
      name: "Fatima Khan",
      cnic: "12345-1234567-2",
      phone: "0301-2345678",
      address: "456 Park Avenue, Lahore",
      purpose: "Document verification",
      status: "completed",
      remarks: "All documents verified successfully",
      createdAt: "2024-01-15 11:15",
    },
    {
      id: 3,
      tokenNumber: "T003",
      name: "Muhammad Hassan",
      cnic: "12345-1234567-3",
      phone: "0302-3456789",
      address: "789 Garden Road, Islamabad",
      purpose: "Medical assistance request",
      status: "in-progress",
      remarks: "Under review by medical team",
      createdAt: "2024-01-15 12:00",
    },
  ]

  const stats = [
    { title: "Assigned Tokens", value: "15", icon: Users, color: "blue" },
    { title: "Pending Review", value: "8", icon: Clock, color: "yellow" },
    { title: "Completed Today", value: "12", icon: CheckCircle, color: "green" },
    { title: "Rejected", value: "2", icon: XCircle, color: "red" },
  ]

  const handleSearch = () => {
    const beneficiary = beneficiaries.find((b) => b.tokenNumber.toLowerCase() === searchToken.toLowerCase())

    if (beneficiary) {
      setSelectedBeneficiary(beneficiary)
      setStatus(beneficiary.status)
      setRemarks(beneficiary.remarks)
      setMessage("")
    } else {
      setSelectedBeneficiary(null)
      setMessage("Token not found. Please check the token number.")
    }
  }

  const handleUpdate = async () => {
    if (!selectedBeneficiary) return

    setLoading(true)
    try {
      // In real app, make API call to update beneficiary
      setMessage("Beneficiary status updated successfully!")

      // Update local state
      setSelectedBeneficiary({
        ...selectedBeneficiary,
        status,
        remarks,
      })
    } catch (error) {
      setMessage("Error updating beneficiary status. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "default"
      case "in-progress":
        return "secondary"
      case "completed":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <ProtectedRoute allowedRoles={["staff"]}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Panel</h1>
            <p className="text-muted-foreground">Search and update beneficiary status</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle>Search Token</CardTitle>
                <CardDescription>Enter token number to find beneficiary details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {message && (
                    <Alert>
                      <AlertDescription>{message}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter token number (e.g., T001)"
                      value={searchToken}
                      onChange={(e) => setSearchToken(e.target.value)}
                    />
                    <Button onClick={handleSearch}>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  {selectedBeneficiary && (
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                      <div className="grid gap-2">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-lg">{selectedBeneficiary.name}</h3>
                          <Badge variant={getStatusColor(selectedBeneficiary.status)}>
                            {selectedBeneficiary.status}
                          </Badge>
                        </div>
                        <p>
                          <strong>Token:</strong> {selectedBeneficiary.tokenNumber}
                        </p>
                        <p>
                          <strong>CNIC:</strong> {selectedBeneficiary.cnic}
                        </p>
                        <p>
                          <strong>Phone:</strong> {selectedBeneficiary.phone}
                        </p>
                        <p>
                          <strong>Address:</strong> {selectedBeneficiary.address}
                        </p>
                        <p>
                          <strong>Purpose:</strong> {selectedBeneficiary.purpose}
                        </p>
                        <p>
                          <strong>Created:</strong> {selectedBeneficiary.createdAt}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Update Status Section */}
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
                <CardDescription>Update beneficiary status and add remarks</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedBeneficiary ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="remarks">Remarks</Label>
                      <Textarea
                        id="remarks"
                        placeholder="Add remarks or notes..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button onClick={handleUpdate} className="w-full" disabled={loading}>
                      {loading ? "Updating..." : "Update Status"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Search for a token to update beneficiary status
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <CardDescription>Recently processed beneficiaries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {beneficiaries.map((beneficiary) => (
                  <div key={beneficiary.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{beneficiary.tokenNumber}</span>
                        <Badge variant={getStatusColor(beneficiary.status)}>{beneficiary.status}</Badge>
                      </div>
                      <p className="text-sm font-medium">{beneficiary.name}</p>
                      <p className="text-sm text-muted-foreground">{beneficiary.purpose}</p>
                      {beneficiary.remarks && (
                        <p className="text-sm text-muted-foreground italic">Remarks: {beneficiary.remarks}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">{beneficiary.createdAt}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
