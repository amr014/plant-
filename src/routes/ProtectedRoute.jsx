import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const user = useAuthStore(
    (state) => state.user
  );

  // not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // admin protection
  if (
    adminOnly &&
    user.role !== "owner" &&
    user.role !== "admin"
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}