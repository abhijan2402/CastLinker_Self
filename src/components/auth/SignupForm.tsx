import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchData, postData } from "@/api/ClientFuntion";

// Updated the schema to use boolean() instead of literal(true)
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Please select a role"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const SignupForm = () => {
  const { signup, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await signup(data.email, data.password, data.name, data.role);

      toast({
        title: "Account created!",
        description: "You can now login with your credentials",
      });
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <div className="text-center">
        <h1 className="text-3xl font-bold gold-gradient-text mb-2">
          Create an Account
        </h1>
        <p className="text-muted-foreground">Join the FilmCollab community</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    className="bg-background/70"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your@email.com"
                    {...field}
                    className="bg-background/70"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="bg-background/70"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I am a</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background/70">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Actor">Actor</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Producer">Producer</SelectItem>
                    <SelectItem value="Screenwriter">Screenwriter</SelectItem>
                    <SelectItem value="Cinematographer">
                      Cinematographer
                    </SelectItem>
                    <SelectItem value="Casting Director">
                      Casting Director
                    </SelectItem>
                    <SelectItem value="Agent">Agent</SelectItem>
                    <SelectItem value="Production Company">
                      Production Company
                    </SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Sound Designer">
                      Sound Designer
                    </SelectItem>
                    <SelectItem value="Production Designer">
                      Production Designer
                    </SelectItem>
                    <SelectItem value="Costume Designer">
                      Costume Designer
                    </SelectItem>
                    <SelectItem value="Makeup Artist">Makeup Artist</SelectItem>
                    <SelectItem value="Stunt Coordinator">
                      Stunt Coordinator
                    </SelectItem>
                    <SelectItem value="Visual Effects Artist">
                      Visual Effects Artist
                    </SelectItem>
                    <SelectItem value="Music Composer">
                      Music Composer
                    </SelectItem>
                    <SelectItem value="Art Director">Art Director</SelectItem>
                    <SelectItem value="Location Manager">
                      Location Manager
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-gold/5">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    I agree to the{" "}
                    <Link to="/terms" className="text-gold hover:text-gold/80">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-gold hover:text-gold/80"
                    >
                      Privacy Policy
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gold hover:bg-gold/90 text-black font-medium"
            disabled={isLoading || authLoading}
          >
            {isLoading || authLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-gold hover:text-gold/80 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Admin Access
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <Link to="/admin/login">
          <Button
            variant="outline"
            className="border-gold/30 text-gold hover:bg-gold/10"
          >
            <Shield className="h-4 w-4 mr-2" />
            Sign in as Administrator
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;
