import axios from "axios"

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// API endpoints
export const authAPI = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
}

export const beneficiaryAPI = {
  create: (data: any) => api.post("/beneficiaries", data),
  getAll: () => api.get("/beneficiaries"),
  getById: (id: string) => api.get(`/beneficiaries/${id}`),
  update: (id: string, data: any) => api.put(`/beneficiaries/${id}`, data),
  delete: (id: string) => api.delete(`/beneficiaries/${id}`),
  search: (token: string) => api.get(`/beneficiaries/search/${token}`),
}

export const userAPI = {
  getAll: () => api.get("/users"),
  create: (data: any) => api.post("/users", data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
}

export const statsAPI = {
  getDashboard: () => api.get("/stats/dashboard"),
  getBeneficiaryStats: () => api.get("/stats/beneficiaries"),
}
