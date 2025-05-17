
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Search, Check, Star, MessageCircle, Bookmark, ArrowUpDown, 
  MapPin, Filter, UserPlus, Badge as BadgeIcon, Heart, Share
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useTalentDirectory, TalentProfile } from "@/hooks/useTalentDirectory";
import { MessageDialog } from "@/components/talent/MessageDialog";
import { ProfileDialog } from "@/components/talent/ProfileDialog";
import { ConnectDialog } from "@/components/talent/ConnectDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { ProfessionFilter } from "@/components/filters/ProfessionFilter";
import { PROFESSION_OPTIONS, Profession } from "@/hooks/useTalentDirectory";
import { LocationFilter, INDIA_LOCATIONS } from "@/components/filters/LocationFilter";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const TalentDirectory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    profiles,
    isLoading,
    filters,
    likedProfiles,
    wishlistedProfiles,
    connectionRequests,
    totalCount,
    pageSize,
    currentPage,
    totalPages,
    updateFilters,
    resetFilters,
    sendMessage,
    toggleLike,
    toggleWishlist,
    shareProfile,
    changePage,
    sendConnectionRequest
  } = useTalentDirectory();
  
  // UI state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<TalentProfile | null>(null);
  
  const handleMessageClick = (profile: TalentProfile) => {
    setSelectedProfile(profile);
    setMessageDialogOpen(true);
  };
  
  const handleViewProfile = (profile: TalentProfile) => {
    // Instead of opening the dialog, redirect to the user's profile page
    navigate(`/profile/${profile.userId}`);
  };
  
  const handleConnectClick = (profile: TalentProfile) => {
    setSelectedProfile(profile);
    setConnectDialogOpen(true);
  };
  
  const handleLikeProfile = async (profile: TalentProfile) => {
    if (!user) {
      toast.error("Please sign in to like profiles");
      return;
    }
    
    // Toggle like locally first for better UX
    toggleLike(profile.id);
    
    try {
      // If the profile was just liked (now in likedProfiles)
      const isLiked = likedProfiles.includes(profile.id);
      
      if (isLiked) {
        // Add to database
        const { error } = await supabase
          .from('talent_likes')
          .insert({
            liker_id: user.id,
            talent_id: profile.userId
          });
          
        if (error) {
          throw error;
        }
        
        toast.success(`You liked ${profile.name}'s profile`);
      } else {
        // Remove from database
        const { error } = await supabase
          .from('talent_likes')
          .delete()
          .match({
            liker_id: user.id,
            talent_id: profile.userId
          });
          
        if (error) {
          throw error;
        }
        
        toast.info(`You unliked ${profile.name}'s profile`);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert local state in case of error
      toggleLike(profile.id);
      toast.error("Could not update like status. Please try again.");
    }
  };
  
  const toggleRole = (role: Profession) => {
    updateFilters({
      selectedRoles: filters.selectedRoles.includes(role)
        ? filters.selectedRoles.filter(r => r !== role)
        : [...filters.selectedRoles, role]
    });
  };
  
  const toggleLocation = (location: string) => {
    updateFilters({
      selectedLocations: filters.selectedLocations.includes(location)
        ? filters.selectedLocations.filter(l => l !== location)
        : [...filters.selectedLocations, location]
    });
  };
  
  const getConnectionStatus = (profile: TalentProfile) => {
    if (!user) return null;
    
    const connection = connectionRequests.find(
      conn => 
        (conn.requesterId === user.id && conn.recipientId === profile.userId) ||
        (conn.requesterId === profile.userId && conn.recipientId === user.id)
    );
    
    return connection ? connection.status : null;
  };
  
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) pages.push('ellipsis');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="space-y-4 pr-1">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-gold-light">
                Talent Directory
              </span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover and connect with talented film industry professionals from around the world.
            </p>
          </div>
          {/* <div className="hidden sm:flex items-center gap-2">
            <Button size="sm" className="bg-gold hover:bg-gold/90 text-black gap-1">
              <UserPlus className="h-4 w-4" />
              <span>Connect</span>
            </Button>
          </div> */}
        </div>
      </div>
      
      <Card className="bg-card/50 backdrop-blur border-gold/10">
        <CardHeader className="px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, role, or keyword..." 
                value={filters.searchTerm}
                onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                className="pl-9 bg-background/50 border-gold/10 focus-visible:ring-gold/30"
              />
            </div>
            
            <div className="flex gap-2">
              <Select 
                value={filters.sortBy} 
                onValueChange={(value) => updateFilters({ sortBy: value as 'rating' | 'experience' | 'reviews' | 'likes' | 'nameAsc' | 'nameDesc' })}
              >
                <SelectTrigger className="w-[180px] border-gold/10 focus:ring-gold/30 bg-background/50">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nameAsc">A to Z</SelectItem>
                  <SelectItem value="nameDesc">Z to A</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                  <SelectItem value="reviews">Most Reviewed</SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                </SelectContent>
              </Select>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="border-gold/10 focus:ring-gold/30">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px] bg-cinematic-dark border-gold/10">
                  <SheetHeader>
                    <SheetTitle className="text-foreground">Talent Filters</SheetTitle>
                    <SheetDescription>Refine your talent search with specific criteria.</SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm text-foreground/80">Profession</h3>
                      <ProfessionFilter
                        selectedProfessions={filters.selectedRoles}
                        onProfessionChange={(professions) => updateFilters({ selectedRoles: professions })}
                      />
                    </div>
                    
                    <Separator className="bg-gold/10" />
                    
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm text-foreground/80">Location</h3>
                      <LocationFilter
                        selectedLocations={filters.selectedLocations}
                        onLocationChange={(locations) => updateFilters({ selectedLocations: locations })}
                      />
                    </div>
                    
                    <Separator className="bg-gold/10" />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm text-foreground/80">Experience (Years)</h3>
                        <span className="text-xs text-gold">
                          {filters.experienceRange[0]} - {filters.experienceRange[1]}+
                        </span>
                      </div>
                      <Slider 
                        defaultValue={filters.experienceRange} 
                        min={0} 
                        max={20} 
                        step={1} 
                        value={filters.experienceRange}
                        onValueChange={(value) => updateFilters({ experienceRange: value as [number, number] })}
                        className="py-2"
                      />
                    </div>
                    
                    <Separator className="bg-gold/10" />
                    
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm text-foreground/80">Additional Filters</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="verifiedOnly"
                            checked={filters.verifiedOnly}
                            onCheckedChange={(checked) => updateFilters({ verifiedOnly: !!checked })}
                            className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                          />
                          <Label htmlFor="verifiedOnly" className="text-sm">Verified Talents Only</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="availableOnly"
                            checked={filters.availableOnly}
                            onCheckedChange={(checked) => updateFilters({ availableOnly: !!checked })}
                            className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                          />
                          <Label htmlFor="availableOnly" className="text-sm">Currently Available Only</Label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="bg-gold/10" />
                    
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm text-foreground/80">Likes Filter</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="likesMinimum" className="min-w-20 text-sm">Minimum Likes:</Label>
                          <Input
                            id="likesMinimum"
                            type="number"
                            min={0}
                            value={filters.likesMinimum}
                            onChange={(e) => updateFilters({ likesMinimum: parseInt(e.target.value) || 0 })}
                            className="h-8 w-24"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {(filters.selectedRoles.length > 0 || filters.selectedLocations.length > 0 || filters.verifiedOnly || 
        filters.availableOnly || filters.experienceRange[0] > 0 || filters.experienceRange[1] < 20 ||
        filters.likesMinimum > 0) && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-sm text-foreground/70">Active filters:</span>
          
          {filters.selectedRoles.map(role => (
            <Button
              key={`filter-${role}`}
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 py-1 bg-gold/10 border-gold/20 hover:bg-gold/20"
              onClick={() => toggleRole(role)}
            >
              {role}
              <span className="ml-1 text-xs">×</span>
            </Button>
          ))}
          
          {filters.selectedLocations.map(location => (
            <Button
              key={`filter-${location}`}
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 py-1 bg-gold/10 border-gold/20 hover:bg-gold/20"
              onClick={() => toggleLocation(location)}
            >
              {location}
              <span className="ml-1 text-xs">×</span>
            </Button>
          ))}
          
          {filters.verifiedOnly && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 py-1 bg-gold/10 border-gold/20 hover:bg-gold/20"
              onClick={() => updateFilters({ verifiedOnly: false })}
            >
              Verified Only
              <span className="ml-1 text-xs">×</span>
            </Button>
          )}
          
          {filters.availableOnly && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 py-1 bg-gold/10 border-gold/20 hover:bg-gold/20"
              onClick={() => updateFilters({ availableOnly: false })}
            >
              Available Only
              <span className="ml-1 text-xs">×</span>
            </Button>
          )}
          
          {(filters.experienceRange[0] > 0 || filters.experienceRange[1] < 20) && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 py-1 bg-gold/10 border-gold/20 hover:bg-gold/20"
              onClick={() => updateFilters({ experienceRange: [0, 20] })}
            >
              Experience: {filters.experienceRange[0]}-{filters.experienceRange[1]}+ yrs
              <span className="ml-1 text-xs">×</span>
            </Button>
          )}
          
          {filters.likesMinimum > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2 py-1 bg-gold/10 border-gold/20 hover:bg-gold/20"
              onClick={() => updateFilters({ likesMinimum: 0 })}
            >
              Min Likes: {filters.likesMinimum}+
              <span className="ml-1 text-xs">×</span>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2 py-1 border-gold/20 hover:bg-gold/10"
            onClick={resetFilters}
          >
            Clear All
          </Button>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-3">
        <p className="text-sm text-foreground/70">
          Found <span className="text-gold font-medium">{totalCount}</span> talents
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
        {isLoading ? (
          Array(6).fill(0).map((_, index) => (
            <Card key={index} className="bg-card border-gold/10 overflow-hidden shadow-lg">
              <CardHeader className="p-4 border-b border-gold/10 bg-gradient-to-r from-gold/5 to-transparent">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-10 w-16" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="h-10 w-full mb-3" />
                <div className="flex flex-wrap gap-1 mb-3">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t border-gold/10 flex justify-between">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
              </CardFooter>
            </Card>
          ))
        ) : profiles.length > 0 ? (
          profiles.map(profile => (
            <Card key={profile.id} className="bg-card border-gold/10 overflow-hidden shadow-lg hover:border-gold/30 transition-all">
              <CardHeader className="p-4 border-b border-gold/10 bg-gradient-to-r from-gold/5 to-transparent">
                <div className="flex items-start gap-3">
                  <Avatar className="h-14 w-14 border-2 border-gold/30">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback>{profile?.username?.charAt(0) || "NA"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg truncate">{profile.name}</CardTitle>
                      {profile.isVerified && (
                        <Check className="h-4 w-4 text-gold bg-gold/20 rounded-full p-0.5" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <span>{profile.user_role}</span>
                      <span className="text-xs">•</span>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">{profile.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-gold mr-1 fill-gold" />
                      <span className="text-sm font-medium">{profile?.rating?.toFixed(1) || 5}</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-3.5 w-3.5 text-rose-400 mr-1" />
                      <span className="text-xs text-foreground/60">{profile?.likesCount}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-foreground/80 line-clamp-3 mb-3">
                  {profile?.bio}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {profile?.skills?.slice(0, 3).map(skill => (
                    <span 
                      key={`${profile.id}-${skill}`} 
                      className="text-xs px-2 py-0.5 bg-gold/10 text-gold/90 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {profile?.skills?.length > 3 && (
                    <span className="text-xs px-2 py-0.5 bg-gold/5 text-gold/70 rounded-full">
                      +{profile?.skills?.length - 3} more
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-foreground/70">
                  <div>
                    <span className="block text-foreground/50">Experience</span>
                    <span className="font-medium text-foreground/80">{profile?.experience} years</span>
                  </div>
                  <div>
                    <span className="block text-foreground/50">Languages</span>
                    <span className="font-medium text-foreground/80">
                      {profile?.languages?.length > 0 
                        ? profile?.languages?.join(", ") 
                        : "English"}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline"
                    size="sm"
                    className={`px-3 border-gold/20 ${
                      likedProfiles?.includes(profile.id) ? 'bg-rose-950/30 text-rose-400' : 'hover:bg-rose-950/20 hover:text-rose-400'
                    }`}
                    onClick={() => handleLikeProfile(profile)}
                  >
                    <Heart 
                      className={`h-4 w-4 mr-1 ${likedProfiles?.includes(profile.id) ? 'fill-rose-400' : ''}`} 
                    />
                    {likedProfiles?.includes(profile.id) ? 'Liked' : 'Like'}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    className={`px-3 border-gold/20 ${
                      wishlistedProfiles?.includes(profile.id) ? 'bg-amber-950/30 text-amber-400' : 'hover:bg-amber-950/20 hover:text-amber-400'
                    }`}
                    onClick={() => toggleWishlist(profile.id)}
                  >
                    <Bookmark 
                      className={`h-4 w-4 mr-1 ${wishlistedProfiles?.includes(profile.id) ? 'fill-amber-400' : ''}`} 
                    />
                    {wishlistedProfiles?.includes(profile.id) ? 'Saved' : 'Save'}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    className="px-3 border-gold/20 hover:bg-blue-950/20 hover:text-blue-400"
                    onClick={() => shareProfile(profile)}
                  >
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t border-gold/10 flex justify-between bg-gradient-to-r from-transparent to-gold/5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 border-gold/20 hover:bg-gold/10"
                  onClick={() => handleMessageClick(profile)}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Message
                </Button>
                
                <div className="flex gap-2">
                  {getConnectionStatus(profile) === 'pending' ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="gap-1 border-gold/20 bg-gold/10 text-gold" 
                      disabled
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Pending
                    </Button>
                  ) : getConnectionStatus(profile) === 'accepted' ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="gap-1 border-green-500/20 bg-green-950/20 text-green-500" 
                      disabled
                    >
                      <Check className="h-3.5 w-3.5" />
                      Connected
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="gap-1 bg-gold text-black hover:bg-gold/90"
                      onClick={() => handleConnectClick(profile)}
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Connect
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    className="bg-gold text-black hover:bg-gold/90"
                    onClick={() => handleViewProfile(profile)}
                  >
                    View Profile
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 bg-card border border-gold/10 rounded-xl p-8 text-center">
            <BadgeIcon className="h-12 w-12 text-gold/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No matching talents found</h3>
            <p className="text-foreground/70 mb-4">
              Try adjusting your search criteria or filters to find talents that match your needs.
            </p>
            <Button onClick={resetFilters} className="bg-gold hover:bg-gold/90 text-black">
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => changePage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => 
                page === 'ellipsis' ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={`page-${page}`}>
                    <PaginationLink 
                      isActive={currentPage === page}
                      onClick={() => typeof page === 'number' && changePage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <MessageDialog 
        isOpen={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        talent={selectedProfile}
        onSendMessage={sendMessage}
      />
      
      <ProfileDialog
        isOpen={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        talent={selectedProfile}
        onMessage={handleMessageClick}
        onConnect={handleConnectClick}
      />
      
      <ConnectDialog 
        isOpen={connectDialogOpen}
        onClose={() => setConnectDialogOpen(false)}
        talent={selectedProfile}
        onConnect={sendConnectionRequest}
      />
    </div>
  );
};

export default TalentDirectory;
