
import { useEffect, useState } from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { JobFilters } from "@/hooks/useJobsData";

interface JobFiltersProps {
  onFilterChange: (filters: Partial<JobFilters>) => void;
  onResetFilters: () => void;
}

const JobFiltersComponent = ({ onFilterChange, onResetFilters }: JobFiltersProps) => {
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [roleCategories, setRoleCategories] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [payRange, setPayRange] = useState([0, 200000]);
  
  const handleJobTypeChange = (checked: boolean | "indeterminate", jobType: string) => {
    setJobTypes(prev => 
      checked 
        ? [...prev, jobType]
        : prev.filter(type => type !== jobType)
    );
  };
  
  const handleRoleCategoryChange = (checked: boolean | "indeterminate", category: string) => {
    setRoleCategories(prev => 
      checked 
        ? [...prev, category]
        : prev.filter(cat => cat !== category)
    );
  };
  
  const handleExperienceChange = (checked: boolean | "indeterminate", level: string) => {
    setExperienceLevels(prev => 
      checked 
        ? [...prev, level]
        : prev.filter(lvl => lvl !== level)
    );
  };
  
  useEffect(() => {
    onFilterChange({
      jobTypes,
      roleCategories,
      experienceLevels,
      minSalary: payRange[0],
      maxSalary: payRange[1]
    });
  }, [jobTypes, roleCategories, experienceLevels, payRange]);
  
  const handleReset = () => {
    setJobTypes([]);
    setRoleCategories([]);
    setExperienceLevels([]);
    setPayRange([0, 200000]);
    onResetFilters();
  };

  return (
    <div className="job-filters rounded-xl p-5 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2 text-gold" />
          <h3 className="font-medium">Filters</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Job Type</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="full-time" 
              checked={jobTypes.includes('Full-time')} 
              onCheckedChange={(checked) => handleJobTypeChange(checked, 'Full-time')} 
            />
            <label htmlFor="full-time" className="text-sm">Full-time</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="part-time" 
              checked={jobTypes.includes('Part-time')} 
              onCheckedChange={(checked) => handleJobTypeChange(checked, 'Part-time')} 
            />
            <label htmlFor="part-time" className="text-sm">Part-time</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="contract" 
              checked={jobTypes.includes('Contract')} 
              onCheckedChange={(checked) => handleJobTypeChange(checked, 'Contract')} 
            />
            <label htmlFor="contract" className="text-sm">Contract</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="temporary" 
              checked={jobTypes.includes('Temporary')} 
              onCheckedChange={(checked) => handleJobTypeChange(checked, 'Temporary')} 
            />
            <label htmlFor="temporary" className="text-sm">Temporary</label>
          </div>
        </div>
      </div>
      
      <Separator className="bg-border/60" />
      
      <div>
        <h4 className="font-medium mb-2">Role Category</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="acting" 
              checked={roleCategories.includes('Acting')} 
              onCheckedChange={(checked) => handleRoleCategoryChange(checked, 'Acting')} 
            />
            <label htmlFor="acting" className="text-sm">Acting</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="directing" 
              checked={roleCategories.includes('Directing')} 
              onCheckedChange={(checked) => handleRoleCategoryChange(checked, 'Directing')} 
            />
            <label htmlFor="directing" className="text-sm">Directing</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="production" 
              checked={roleCategories.includes('Production')} 
              onCheckedChange={(checked) => handleRoleCategoryChange(checked, 'Production')} 
            />
            <label htmlFor="production" className="text-sm">Production</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="writing" 
              checked={roleCategories.includes('Writing')} 
              onCheckedChange={(checked) => handleRoleCategoryChange(checked, 'Writing')} 
            />
            <label htmlFor="writing" className="text-sm">Writing</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="technical" 
              checked={roleCategories.includes('Technical')} 
              onCheckedChange={(checked) => handleRoleCategoryChange(checked, 'Technical')} 
            />
            <label htmlFor="technical" className="text-sm">Technical</label>
          </div>
        </div>
      </div>
      
      <Separator className="bg-border/60" />
      
      <div>
        <h4 className="font-medium mb-2">Experience Level</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="entry-level" 
              checked={experienceLevels.includes('Entry Level')} 
              onCheckedChange={(checked) => handleExperienceChange(checked, 'Entry Level')} 
            />
            <label htmlFor="entry-level" className="text-sm">Entry Level</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="mid-level" 
              checked={experienceLevels.includes('Mid Level')} 
              onCheckedChange={(checked) => handleExperienceChange(checked, 'Mid Level')} 
            />
            <label htmlFor="mid-level" className="text-sm">Mid Level</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="senior-level" 
              checked={experienceLevels.includes('Senior Level')} 
              onCheckedChange={(checked) => handleExperienceChange(checked, 'Senior Level')} 
            />
            <label htmlFor="senior-level" className="text-sm">Senior Level</label>
          </div>
        </div>
      </div>
      
      <Separator className="bg-border/60" />
      
      <div>
        <div className="flex justify-between mb-2">
          <h4 className="font-medium">Pay Range</h4>
          <span className="text-sm text-muted-foreground">
            ${payRange[0].toLocaleString()} - ${payRange[1].toLocaleString()}
          </span>
        </div>
        <Slider
          defaultValue={[0, 200000]}
          min={0}
          max={200000}
          step={5000}
          value={payRange}
          onValueChange={setPayRange}
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default JobFiltersComponent;
