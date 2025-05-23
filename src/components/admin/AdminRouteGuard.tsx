
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminRouteGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const AdminRouteGuard = ({ children, requiredPermission }: AdminRouteGuardProps) => {
  const { isAdmin, can } = useAdminAuth();
  
  // Check if user is an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Shield className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You don't have permission to access the admin panel.</p>
        <Button onClick={() => window.location.href = "/"}>Return to Home</Button>
      </div>
    );
  }
  
  // If a specific permission is required, check for it
  if (requiredPermission && !can(requiredPermission)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Shield className="h-12 w-12 text-orange-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Permission Denied</h1>
        <p className="text-muted-foreground mb-4">You don't have the required permissions for this section.</p>
        <Button onClick={() => window.location.href = "/admin/dashboard"}>Return to Admin Dashboard</Button>
      </div>
    );
  }
  
  // User has access, render the children
  return <>{children}</>;
};

export default AdminRouteGuard;
