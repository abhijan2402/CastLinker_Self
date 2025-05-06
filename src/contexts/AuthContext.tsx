import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { postData } from "@/api/ClientFuntion";

// Define User interface

export interface User {
  id: number;
  email: string;
  role: string;
  type: string;
  isLoggedIn: boolean;
  token: string;

  username?: string;
  bio?: string;
  age_range?: string;
  weight?: string;
  height?: string;
  eye_color?: string;
  hair_color?: string;
  union_status?: string;
  languages?: string;
  representation?: string;
  special_skills?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Match this with your API response
interface LoginResponse {
  user: {
    id: number;
    email: string;
    user_role: string;
    user_type: string;
    // Add optional fields you might use later
    username?: string;
    bio?: string;
    age_range?: string;
    weight?: string;
    height?: string;
    eye_color?: string;
    hair_color?: string;
    union_status?: string;
    languages?: string;
    representation?: string;
    special_skills?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  token: string;
}
interface SingupResponse {
  user: {
    id: number;
    email: string;
    user_role: string;
    user_type: string;
    // Add optional fields you might use later
    username?: string;
    bio?: string;
    age_range?: string;
    weight?: string;
    height?: string;
    eye_color?: string;
    hair_color?: string;
    union_status?: string;
    languages?: string;
    representation?: string;
    special_skills?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  token: string;
}

// Define AuthContext interface
interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  logout: () => void;
  signup: (
    email: string,
    password: string,
    name: string,
    role: string
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  signup: async () => {},
  isLoading: false,
  error: null,
});

// Create custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Convert Supabase user to our User format
// const formatUser = (supabaseUser: SupabaseUser | null): User | null => {
//   if (!supabaseUser) return null;

//   return {
//     id: supabaseUser.id,
//     name:
//       supabaseUser.user_metadata?.name ||
//       supabaseUser.email?.split("@")[0] ||
//       "",
//     email: supabaseUser.email || "",
//     role: supabaseUser.user_metadata?.role || "Actor",
//     avatar: supabaseUser.user_metadata?.avatar_url || "/images/avatar.png",
//     isLoggedIn: true,
//     token: "ssasgf",
//   };-

// Auth Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  console.log(user);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for existing session on mount
  // useEffect(() => {
  //   // First set up the auth state listener to prevent missing auth events
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((event, session) => {
  //     const formattedUser = formatUser(session?.user || null);
  //     setUser(formattedUser);
  //     setIsLoading(false);

  //     if (event === "SIGNED_IN" && formattedUser) {
  //       toast({
  //         title: "Welcome back!",
  //         description: `You are logged in as ${formattedUser.name}`,
  //       });
  //     }

  //     if (event === "SIGNED_OUT") {
  //       toast({
  //         title: "Signed out",
  //         description: "You have been logged out successfully",
  //       });
  //     }
  //   });

  //   // Then check for existing session
  //   const checkSession = async () => {
  //     try {
  //       const { data, error } = await supabase.auth.getSession();
  //       if (error) throw error;

  //       if (data.session) {
  //         const formattedUser = formatUser(data.session.user);
  //         setUser(formattedUser);
  //       }
  //     } catch (err) {
  //       console.error("Error checking auth session:", err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkSession();

  //   return () => {
  //     subscription?.unsubscribe();
  //   };
  // }, [toast]);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const payload = { email, password };

      const loginResponse = await postData<LoginResponse>(
        "/auth/login",
        payload
      );
      console.log(loginResponse);

      if ((loginResponse as any)?.error) {
        const errorMessage = (loginResponse as any).error;
        toast({
          title: "Login failed",
          description: "Check your credentials and try again",
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
      console.log(loginResponse);

      // Later in login:
      const formattedUser: User = {
        id: loginResponse.user.id,
        email: loginResponse.user.email,
        role: loginResponse.user.user_role,
        type: loginResponse.user.user_type,
        isLoggedIn: true,
        token: loginResponse.token,

        // Optional fields from backend response
        username: loginResponse.user.username,
        bio: loginResponse.user.bio,
        age_range: loginResponse.user.age_range,
        weight: loginResponse.user.weight,
        height: loginResponse.user.height,
        eye_color: loginResponse.user.eye_color,
        hair_color: loginResponse.user.hair_color,
        union_status: loginResponse.user.union_status,
        languages: loginResponse.user.languages,
        representation: loginResponse.user.representation,
        special_skills: loginResponse.user.special_skills,
        createdAt: loginResponse.user.createdAt,
        updatedAt: loginResponse.user.updatedAt,
      };

      setUser(formattedUser);
      // Save token to localStorage
      localStorage.setItem("token", loginResponse.token);

      // Remember login state
      if (rememberMe) {
        localStorage.setItem("rememberLogin", "true");
      } else {
        localStorage.removeItem("rememberLogin");
      }
    } catch (error: any) {
      setError("Failed to login");
      toast({
        title: "Login failed",
        description: "Check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const registerResponse = await postData<SingupResponse>(
        "/auth/register",
        {
          email,
          password,
          username: name,
          user_type: role,
          user_role: "user",
        }
      );

      // ❗ If response contains an error field, throw it
      if ((registerResponse as any)?.error) {
        toast({
          title: "Signup failed",
          description: "Check your credentials and try again",
          variant: "destructive",
        });
        throw new Error((registerResponse as any).error);
      }

      const formattedUser: User = {
        id: registerResponse.user.id,
        email: registerResponse.user.email,
        role: registerResponse.user.user_role,
        type: registerResponse.user.user_type,
        isLoggedIn: true,
        token: registerResponse.token,

        // Optional fields from backend response
        username: registerResponse.user.username,
        bio: registerResponse.user.bio,
        age_range: registerResponse.user.age_range,
        weight: registerResponse.user.weight,
        height: registerResponse.user.height,
        eye_color: registerResponse.user.eye_color,
        hair_color: registerResponse.user.hair_color,
        union_status: registerResponse.user.union_status,
        languages: registerResponse.user.languages,
        representation: registerResponse.user.representation,
        special_skills: registerResponse.user.special_skills,
        createdAt: registerResponse.user.createdAt,
        updatedAt: registerResponse.user.updatedAt,
      };

      setUser(formattedUser);

      localStorage.setItem("token", registerResponse.token);

      // Additional optional setup steps are commented out
      // Step 2: Create user profile via your backend
      // const profilePayload = {
      //   user_email: email,
      //   display_name: name,
      //   role: role || "Actor",
      //   avatar_url: "/images/avatar.png",
      //   verified: false,
      //   bio: Hi, I'm ${name}! I'm a ${
      //     role || "Actor"
      //   } looking to connect with other film industry professionals.,
      //   headline: ${role || "Actor"} | Available for Projects,
      //   location: "Remote",
      // };

      // const profileResponse = await postData("/user/setup-profile", {
      //   payload: profilePayload,
      // });

      // Step 3: Add default skills (optional)
      // const defaultSkills = getDefaultSkillsForRole(role);
      // if (defaultSkills.length > 0) {
      //   const skillsPayload = defaultSkills.map((skill) => ({
      //     user_email: email,
      //     skill,
      //   }));

      //   await postData("/user/setup-skills", { payload: skillsPayload });
      // }

      // toast({
      //   title: "Account created successfully!",
      //   description: "Welcome to CastLinker!",
      // });
    } catch (error: any) {
      setError("Failed to create account");

      toast({
        title: "Signup failed",
        description: "Please try again with different credentials",
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get default skills based on role
  const getDefaultSkillsForRole = (role: string): string[] => {
    switch (role) {
      case "Actor":
        return ["Method Acting", "Improvisation", "Voice Acting"];
      case "Director":
        return ["Shot Composition", "Script Analysis", "Team Leadership"];
      case "Producer":
        return ["Project Management", "Budgeting", "Team Coordination"];
      case "Screenwriter":
        return ["Story Development", "Character Creation", "Dialogue Writing"];
      case "Cinematographer":
        return ["Camera Operation", "Lighting", "Shot Composition"];
      case "Editor":
        return ["Video Editing", "Sound Editing", "Color Correction"];
      case "Sound Designer":
        return ["Sound Mixing", "Foley Art", "Audio Post-production"];
      case "Production Designer":
        return ["Set Design", "Art Direction", "Visual Storytelling"];
      default:
        return [];
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("rememberLogin");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const value = {
    user,
    login,
    logout,
    signup,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
