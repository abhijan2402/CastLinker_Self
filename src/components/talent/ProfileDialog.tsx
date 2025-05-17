
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle, UserPlus, MapPin, ArrowRight, Calendar, Check, Languages } from 'lucide-react';
import { TalentProfile } from '@/types/talent';

interface ProfileDialogProps {
  talent?: TalentProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onMessage?: (talent: TalentProfile) => void;
  onConnect?: (talent: TalentProfile) => void;
}

export function ProfileDialog({ talent, isOpen, onClose, onMessage, onConnect }: ProfileDialogProps) {
  if (!talent) return null;

  const handleMessageClick = () => {
    if (talent && onMessage) {
      onMessage(talent);
    }
  };

  const handleConnectClick = () => {
    if (talent && onConnect) {
      onConnect(talent);
    }
  };

  const displayName = talent?.name || 'Talent';
  const fallbackInitial = displayName.charAt(0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Talent Profile</DialogTitle>
          <DialogDescription>
            View detailed information about this talent
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/10">
              <AvatarImage src={talent.avatar} alt={talent.name || 'Talent'} />
              <AvatarFallback>{fallbackInitial}</AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{displayName}</h3>
                {talent.isVerified && (
                  <Badge variant="outline" className="border-blue-400 text-blue-500">
                    <Check className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground">
                {talent.role || talent.profession_type}
              </p>
              
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium">{talent.rating || 0}</span>
                <span className="text-muted-foreground text-sm">({talent.reviews || 0} reviews)</span>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
              <MapPin className="h-5 w-5 text-primary/70 mb-1" />
              <span className="text-xs text-center">{talent.location}</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
              <Calendar className="h-5 w-5 text-primary/70 mb-1" />
              <span className="text-xs text-center">{talent.experience || talent.experience_years || 0} Years Exp.</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
              <Languages className="h-5 w-5 text-primary/70 mb-1" />
              <span className="text-xs text-center">{talent.languages ? talent.languages.join(', ') : 'English'}</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg">
              <Star className="h-5 w-5 text-primary/70 mb-1" />
              <span className="text-xs text-center">{talent.likesCount || 0} Likes</span>
            </div>
          </div>
          
          {/* Bio */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">About</h4>
            <p className="text-sm text-muted-foreground">
              {talent.bio}
            </p>
          </div>
          
          {/* Skills */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {talent?.skills?.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
          
          {/* Featured Work */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Featured In</h4>
            <div className="space-y-1">
              {(talent.featuredIn || []).map((work, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 text-sm p-2 hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <ArrowRight className="h-3 w-3 text-primary/70" />
                  <span>{work}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleMessageClick}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Send Message
          </Button>
          
          <Button 
            className="flex-1"
            onClick={handleConnectClick}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Connect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
