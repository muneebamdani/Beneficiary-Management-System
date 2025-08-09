// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    console.log("⏳ Waiting for auth to load...");
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("❌ No user → redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (role && user.role.toLowerCase() !== role.toLowerCase()) {
    console.log(`⚠️ Role mismatch: ${user.role} vs ${role}`);
    const roleRedirectMap = {
      admin: "/admin",
      receptionist: "/receptionist",
      staff: "/staff",
      "department staff": "/staff",
    };
    return <Navigate to={roleRedirectMap[user.role] || "/"} replace />;
  }

  console.log("✅ Access granted");
  return children;
}
