
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AccessDenied from "./AccessDenied";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Auto collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  if (!user || !user.user_role.includes("admin")) {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <AdminSidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? "ml-[70px]" : "ml-[250px]"
      }`}>
        <AdminHeader toggleSidebar={toggleSidebar} />
        
        <main className="p-4 md:p-6 overflow-y-auto flex-1">
          <div className="max-w-[2000px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
