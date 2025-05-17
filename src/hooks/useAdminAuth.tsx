import { useAuth } from "@/contexts/AuthContext";
import { hasPermission } from "@/lib/adminPermissions";
import { useEffect, useState } from "react";
import { AdminTeamRole } from "@/types/adminTypes";

interface AdminUser {
  role: AdminTeamRole;
}

export const useAdminAuth = () => {
  const { user } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (user?.user_role) {
      // Directly assign role if it matches AdminTeamRole, else default to null or something
      const validRoles: AdminTeamRole[] = [
        "super_admin",
        "content_manager",
        "recruiter",
        "moderator",
      ];

      // Check if user_role exactly matches one of the valid roles
      if (validRoles.includes(user.user_role as AdminTeamRole)) {
        setAdminUser({ role: user.user_role as AdminTeamRole });
        setIsAdmin(true);
      } else if (user.user_role === "admin") {
        // If just "admin" without specific role, assign a default role like "moderator"
        setAdminUser({ role: "moderator" });
        setIsAdmin(true);
      } else {
        setAdminUser(null);
        setIsAdmin(false);
      }
    } else {
      setAdminUser(null);
      setIsAdmin(false);
    }
  }, [user]);

  const can = (permission: string): boolean => {
    if (!adminUser) return false;
    return hasPermission(adminUser.role, permission);
  };

  return {
    isAdmin,
    adminUser,
    can,
  };
};

export default useAdminAuth;
