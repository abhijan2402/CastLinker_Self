
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ThemeToggleProps {
  showTooltip?: boolean;
  className?: string;
}

const ThemeToggle = ({ showTooltip = true, className = '' }: ThemeToggleProps) => {
  
  const { theme, toggleTheme } = useTheme();

  const toggleButton = (
    <Button 
      variant="outline" 
      size="icon" 
      // onClick={toggleTheme}
      className={`rounded-xl ${
        theme === 'light' 
          ? 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-600' 
          : 'border-gold/30 hover:bg-gold/10 text-gold'
      } shadow-sm ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );

  if (!showTooltip) {
    return toggleButton;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {toggleButton}
        </TooltipTrigger>
        <TooltipContent side="right" className={theme === 'light' ? 'bg-white border-gray-200 text-gray-800' : ''}>
          <p>{theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle;
