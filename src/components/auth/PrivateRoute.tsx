import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type PrivateRouteProps = {
  children: React.ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state if still checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login with return URL
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If user is admin, redirect to admin route
  // if (user.role === "admin" && location.pathname !== "/admin/dashboard") {
  //   return <Navigate to="/admin/dashboard" replace />;
  // }

  // If user is authenticated (and not admin or already at /admin), render the children
  return <>{children}</>;
};

export default PrivateRoute;
