import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit, UserPlus, Shield, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { roles, permissions } from "@/lib/adminPermissions";
import { toast } from "sonner";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import RoleEditor from "@/components/admin/RoleEditor";
import { AdminUserRole, AdminTeamRole } from "@/types/adminTypes";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: AdminTeamRole;
  joined_date: string;
  avatar_url?: string;
}

const TeamManagement = () => {
  const { adminUser, can } = useAdminAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog states
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showRoleEditorDialog, setShowRoleEditorDialog] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  
  // New member form data
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    email: "",
    role: "moderator" as AdminTeamRole
  });

  // Fetch team members on component mount
  useEffect(() => {
    fetchTeamMembers();
  }, []);
  
  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users_management')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setTeamMembers(data as unknown as TeamMember[] || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    try {
      const roleValue = newMemberData.role as unknown as AdminUserRole;
      
      const { data, error } = await supabase
        .from('users_management')
        .insert({
          name: newMemberData.name,
          email: newMemberData.email,
          role: roleValue,
          verified: true,
          status: 'active'
        })
        .select();
      
      if (error) throw error;
      
      if (data) {
        setTeamMembers(prev => [...prev, ...(data as unknown as TeamMember[])]);
        setShowAddMemberDialog(false);
        toast.success("Team member added successfully!");
        setNewMemberData({ name: "", email: "", role: "moderator" });
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
    }
  };

  const handleUpdateRole = async (selectedRole: string) => {
    if (!currentMember) return;
    
    try {
      const roleValue = selectedRole as unknown as AdminUserRole;
      
      const { error } = await supabase
        .from('users_management')
        .update({ role: roleValue })
        .eq('id', currentMember.id);
      
      if (error) throw error;
      
      setTeamMembers(prev => prev.map(member => 
        member.id === currentMember.id ? { ...member, role: selectedRole as AdminTeamRole } : member
      ));
      setShowRoleDialog(false);
      toast.success(`${currentMember.name}'s role updated to ${selectedRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case 'content_manager':
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case 'recruiter':
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case 'moderator':
        return "bg-orange-500/10 text-orange-500 border-orange-500/30";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  const renderRoleBadge = (role: string) => {
    const roleInfo = roles.find(r => r.id === role) || { name: role, permissions: [] };
    return (
      <Badge className={getRoleColor(role)}>
        {roleInfo.name}
        <span className="ml-1 text-xs opacity-70">({roleInfo.permissions.length})</span>
      </Badge>
    );
  };

  const canEditRoles = adminUser?.role === 'super_admin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gold-gradient-text">Team Management</h1>
        {canEditRoles && (
          <Button 
            className="bg-gold text-black hover:bg-gold/90"
            onClick={() => setShowAddMemberDialog(true)}
          >
            <UserPlus className="h-5 w-5 mr-2" /> Add Team Member
          </Button>
        )}
      </div>

      <Card className="bg-card-gradient backdrop-blur-sm border-gold/10">
        <CardHeader className="space-y-1">
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your admin team and their permissions</CardDescription>
          <div className="flex justify-between items-center mt-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search team members..."
                className="pl-10 bg-background/50 border-gold/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {canEditRoles && (
              <Button 
                variant="outline" 
                onClick={() => setShowRoleEditorDialog(true)}
                className="ml-2"
              >
                <Shield className="h-4 w-4 mr-2" />
                Edit Roles & Permissions
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-gold/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-card">
                <TableRow>
                  <TableHead>Team Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      Loading team members...
                    </TableCell>
                  </TableRow>
                ) : filteredMembers.length > 0 ? (
                  filteredMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8 border border-gold/10">
                            <AvatarImage src={member.avatar_url || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{renderRoleBadge(member.role)}</TableCell>
                      <TableCell>{new Date(member.joined_date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {canEditRoles && (
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-gold"
                            onClick={() => {
                              setCurrentMember(member);
                              setShowRoleDialog(true);
                            }}
                          >
                            <span className="sr-only">Edit role</span>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No team members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="bg-card-gradient backdrop-blur-sm border-gold/10 sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to your admin team
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Enter name" 
                value={newMemberData.name}
                onChange={(e) => setNewMemberData({...newMemberData, name: e.target.value})}
                className="bg-background/50 border-gold/10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter email address" 
                value={newMemberData.email}
                onChange={(e) => setNewMemberData({...newMemberData, email: e.target.value})}
                className="bg-background/50 border-gold/10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newMemberData.role}
                onValueChange={(value: string) => setNewMemberData({...newMemberData, role: value as AdminTeamRole})}
              >
                <SelectTrigger className="bg-background/50 border-gold/10">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {roles.find(role => role.id === newMemberData.role)?.description || ""}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>Cancel</Button>
            <Button onClick={handleAddMember} disabled={!newMemberData.name || !newMemberData.email}>
              Add Team Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="bg-card-gradient backdrop-blur-sm border-gold/10 sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Update the role and permissions for {currentMember?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-4">
              <Label>Select Role</Label>
              <div className="grid grid-cols-1 gap-4">
                {roles.map(role => (
                  <div 
                    key={role.id} 
                    className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${
                      currentMember?.role === role.id 
                        ? 'bg-gold/10 border-gold' 
                        : 'border-border hover:border-gold/50'
                    }`}
                    onClick={() => handleUpdateRole(role.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-base font-medium">{role.name}</h4>
                        <Badge className={`ml-2 ${getRoleColor(role.id)}`}>
                          {role.permissions.length} permissions
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {role.permissions.slice(0, 3).map(permId => {
                          const perm = permissions.find(p => p.id === permId);
                          return perm ? (
                            <Badge key={perm.id} variant="outline" className="text-xs">
                              {perm.name}
                            </Badge>
                          ) : null;
                        })}
                        {role.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRoleEditorDialog} onOpenChange={setShowRoleEditorDialog}>
        <DialogContent className="bg-card-gradient backdrop-blur-sm border-gold/10 sm:max-w-[800px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Role & Permission Editor</DialogTitle>
            <DialogDescription>
              Edit roles and their associated permissions
            </DialogDescription>
          </DialogHeader>
          <RoleEditor />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
