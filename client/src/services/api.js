import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt_token"); // fixed key name
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ✅ API functions
export const apiService = {
  // Login
  signin: async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  },

  // Self Signup (if used on public site)
  signup: async ({ name, email, password, role }) => {
    const res = await api.post("/auth/signup", {
      name,
      email,
      password,
      role,
    });
    return res.data;
  },

  // ✅ Admin creates a new user
  createUser: async ({ name, email, password, role }) => {
    const res = await api.post("/users", {
      name,
      email,
      password,
      role,
    });
    return res.data;
  },

  // Get all users (for admin)
  getUsers: async () => {
    const res = await api.get("/users");
    return res.data;
  },

  // Delete a user by ID
  deleteUser: async (userId) => {
    const res = await api.delete(`/users/${userId}`);
    return res.data;
  },

  // Update a user by ID
  updateUser: async (userId, userData) => {
    const res = await api.put(`/users/${userId}`, userData);
    return res.data;
  },

  // ✅ Receptionist: Get all beneficiaries created by them
  getBeneficiaries: async () => {
    const res = await api.get("/beneficiaries");
    return res.data;
  },

  // ✅ Receptionist: Create new beneficiary
  createBeneficiary: async (data) => {
    const res = await api.post("/beneficiaries", data);
    return res.data;
  },

  // 🔍 Department staff: Search beneficiary by tokenID
  getBeneficiaryByToken: async (tokenID) => {
    const res = await api.get(`/beneficiaries?tokenID=${tokenID}`);
    return res.data;
  },

  // ✏️ Department staff: Update beneficiary (status, remarks)
  updateBeneficiary: async (id, data) => {
    const res = await api.put(`/beneficiaries/${id}`, data);
    return res.data;
  },
};
