"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { api } from "./api"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "receptionist" | "staff"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        // Set default authorization header
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      } catch (error) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }

    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    try {
      // Mock authentication - in real app, this would be an API call
      let mockUser: User

      if (email === "admin@example.com" && password === "admin123") {
        mockUser = { id: "1", email, name: "Admin User", role: "admin" }
      } else if (email === "receptionist@example.com" && password === "rec123") {
        mockUser = { id: "2", email, name: "Receptionist User", role: "receptionist" }
      } else if (email === "staff@example.com" && password === "staff123") {
        mockUser = { id: "3", email, name: "Staff User", role: "staff" }
      } else {
        throw new Error("Invalid credentials")
      }

      const mockToken = "mock-jwt-token-" + Date.now()

      // Store in localStorage
      localStorage.setItem("token", mockToken)
      localStorage.setItem("user", JSON.stringify(mockUser))

      // Set authorization header
      api.defaults.headers.common["Authorization"] = `Bearer ${mockToken}`

      setUser(mockUser)
      return mockUser
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
    window.location.href = "/login"
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
