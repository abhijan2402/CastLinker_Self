import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  User,
  Settings,
  Shield,
  LogOut,
  CreditCard,
  HelpCircle,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNotifications } from "@/hooks/useNotifications";

const TopBar = () => {
  const { user, logout } = useAuth();
  const { isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const { notifications, isLoading } = useNotifications();

  const [isSearchOpen, setIsSearchOpen] = useState(false); // For mobile view

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user.username
    ? user.username
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="w-full border-b border-gold/10 bg-background/90 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-2 sm:px-4">
        {/* Search Bar - Hidden on mobile unless toggled */}
        {isSearchOpen ? (
          <div className="absolute left-0 top-0 w-full z-20 p-3 bg-background border-b border-gold/10">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-background/60 pl-9 focus-visible:ring-gold/30 rounded-xl"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Menu Button - Could be linked to toggle sidebar */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            {/* Desktop Search */}
            <div className="hidden md:block w-1/3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full bg-background/60 pl-9 focus-visible:ring-gold/30 rounded-xl"
                />
              </div>
            </div>

            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground rounded-xl"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="h-5 w-5" />
            {notifications?.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[10px] rounded-full"
              >
                {notifications?.length}
              </Badge>
            )}
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-9 gap-1 sm:gap-2 px-1 sm:px-2 rounded-xl hover:bg-gold/5"
              >
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-gold/20">
                  <AvatarImage src={user?.avatar_url} alt={user.username} />
                  <AvatarFallback className="bg-gold/10 text-gold text-xs sm:text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="text-sm font-medium leading-none capitalize">
                    {user?.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.user_role}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="rounded-lg"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/settings")}
                  className="rounded-lg"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/billing")}
                  className="rounded-lg"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </DropdownMenuItem>
                {/* <DropdownMenuItem
                  onClick={() => navigate("/pricing")}
                  className="rounded-lg"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pricing
                </DropdownMenuItem> */}
              </DropdownMenuGroup>

              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/admin/dashboard")}
                    className="rounded-lg"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/privacy")}
                className="rounded-lg"
              >
                <Shield className="mr-2 h-4 w-4" />
                Privacy
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/help")}
                className="rounded-lg"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 focus:text-red-500 rounded-lg"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
