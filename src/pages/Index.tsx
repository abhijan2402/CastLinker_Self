
import Hero from "@/components/Hero";
import RoleSelection from "@/components/RoleSelection";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { theme } = useTheme();
  
  useEffect(() => {
    // Add a slight delay to check user login state to avoid flash of landing page
    const timer = setTimeout(() => {
      // Check if user is logged in, redirect to dashboard
      if (user) {
        navigate('/dashboard');
      } else {
        setLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [navigate, user]);

  // Show a temporary loading state while checking user login
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "light" ? "bg-white" : "bg-cinematic"
        }`}
      >
        <div className="text-center">
          <h1
            className={`text-3xl font-bold ${
              theme === "light" ? "text-amber-600" : "gold-gradient-text"
            } mb-4`}
          >
            FilmCollab
          </h1>
          <div className="flex space-x-2 justify-center">
            <div
              className={`w-3 h-3 rounded-full ${
                theme === "light" ? "bg-amber-500" : "bg-gold"
              } animate-pulse`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full ${
                theme === "light" ? "bg-amber-500" : "bg-gold"
              } animate-pulse [animation-delay:0.2s]`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full ${
                theme === "light" ? "bg-amber-500" : "bg-gold"
              } animate-pulse [animation-delay:0.4s]`}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Show landing page for non-logged in users
  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white' : 'bg-cinematic'} text-foreground`}>
      <Hero />
      <div className={theme === 'light' ? 'bg-amber-50/60' : ''}>
        <RoleSelection />
      </div>
      <Features />
      <div className={theme === 'light' ? 'bg-amber-50/60' : ''}>
        <CTA />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
