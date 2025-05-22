
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Settings, LogOut, Menu, X, Search, ChevronDown, User, HelpCircle, FolderKanban } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

const AdminHeader = ({
  toggleSidebar
}: AdminHeaderProps) => {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    theme
  } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications] = useState(3); // Mock notification count

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel"
    });
    navigate("/");
  };

  if (!user) return null;
  const initials = user.username ? user.username.split(' ').map((n: string) => n[0]).join('') : '?';

  return <div className="border-b border-gold/10 bg-background/90 backdrop-blur-sm h-16">
      <div className="flex h-full items-center justify-between px-4">
        {isSearchOpen ? <div className="absolute left-0 top-0 w-full z-20 p-3 bg-background border-b border-gold/10">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-full bg-background/60 pl-9 focus-visible:ring-gold/30 rounded-xl" autoFocus />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1" onClick={() => setIsSearchOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div> : <>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden md:flex items-center">
                
              </div>
            </div>

            <div className="w-full max-w-lg mx-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search..." className="w-full bg-background/60 pl-9 focus-visible:ring-gold/30 rounded-xl" />
              </div>
            </div>
          </>}
        
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-gold/5 rounded-xl" onClick={() => navigate('/admin/notifications')}>
            <Bell className="h-5 w-5" />
            {notifications > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[10px] rounded-full">
                {notifications}
              </Badge>}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-1 sm:gap-2 px-1 sm:px-2 rounded-xl hover:bg-gold/5">
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-gold/20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gold/10 text-gold text-xs sm:text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="text-sm font-medium leading-none">{user.username}</span>
                  <span className="text-xs text-muted-foreground">Admin</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl" align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate('/admin/profile')} className="rounded-lg hover:bg-gold/5">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={() => navigate('/projects')} className="rounded-lg hover:bg-gold/5">
                  <FolderKanban className="mr-2 h-4 w-4" />
                  Projects
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => navigate('/admin/settings')} className="rounded-lg hover:bg-gold/5">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/help')} className="rounded-lg hover:bg-gold/5">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 rounded-lg hover:bg-red-900/10">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>;
};

export default AdminHeader;
