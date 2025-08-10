import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("jwt_token");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          return;
        }

        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload && payload.role && payload.id) {
              const newUser = {
                id: payload.id,
                role: payload.role.toLowerCase(),
              };
              setUser(newUser);
              localStorage.setItem("user", JSON.stringify(newUser));
              return;
            }
          } catch (err) {
            console.error("Invalid token decode", err);
            localStorage.removeItem("jwt_token");
          }
        }
      } catch (err) {
        console.error("Error restoring user:", err);
      } finally {
        setLoading(false); // only now mark loading as false
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("https://6cef8c4e-260e-40c3-b0bc-158d964ff6b4-00-1nod9ig07vha9.pike.replit.dev:3000/api/auth/login", {
      email,
      password,
    });
    const { token } = res.data;
    localStorage.setItem("jwt_token", token);

    const payload = JSON.parse(atob(token.split(".")[1]));
    const roleLower = payload.role?.toLowerCase() || "";
    const newUser = { id: payload.id, role: roleLower };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));

    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
