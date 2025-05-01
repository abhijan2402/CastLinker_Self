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

  // If user is not authenticated, redirect to login with the return URL
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If user is authenticated, render the children components
  return <>{children}</>;
};

export default PrivateRoute;
