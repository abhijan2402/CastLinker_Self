
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { JobFilters } from "@/hooks/useJobsData";

interface JobListingHeaderProps {
  onSearch: (filters: Partial<JobFilters>) => void;
}

const JobListingHeader = ({ onSearch }: JobListingHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    onSearch({
      search: searchTerm,
      location: location
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-card-gradient border border-gold/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-foreground/40" />
            <Input 
              type="text"
              placeholder="Job title, keyword, or company"
              className="pl-10 bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          
          <div className="md:col-span-2 relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-foreground/40" />
            <Input 
              type="text"
              placeholder="Location (city or remote)"
              className="pl-10 bg-cinematic-dark/50 border-gold/10 focus:border-gold"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          
          <div className="md:col-span-2">
            <Button 
              className="w-full bg-gold hover:bg-gold-dark text-cinematic h-10"
              onClick={handleSearch}
            >
              Search Jobs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListingHeader;
