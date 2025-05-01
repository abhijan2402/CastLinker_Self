
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/lib/adminPermissions';
import { useEffect, useState } from "react";
import { AdminTeamRole } from '@/types/adminTypes';

interface AdminUser {
  role: AdminTeamRole;
}

export const useAdminAuth = () => {
  const { user } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    if (user?.email?.includes("admin")) {
      let role: AdminTeamRole = 'moderator'; // default role
      
      if (user.email.includes("super")) {
        role = 'super_admin';
      } else if (user.email.includes("content")) {
        role = 'content_manager';
      } else if (user.email.includes("recruiter")) {
        role = 'recruiter';
      }
      
      setAdminUser({ role });
      setIsAdmin(true);
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
    can
  };
};


export default useAdminAuth;
