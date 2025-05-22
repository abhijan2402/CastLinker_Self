import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const AdminLoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // For demonstration, we're adapting the existing login but verifying admin role
      // In a real app, this would use a separate admin auth endpoint
      await login(data.email, data.password, data.rememberMe);

      // Mock admin verification - in a real app, this would be server-validated
      // For this demo, we're considering emails containing "admin" as admin accounts
      if (data.email.includes("admin")) {
        toast({
          title: "Welcome back, Admin",
          description: "You've successfully logged in to the admin dashboard.",
          variant: "default",
        });
        navigate("/admin/dashboard"); // Ensure consistent redirect to admin dashboard
      } else {
        setError("You don't have admin access privileges.");
        // Logout the user if they're not an admin
        // In a real app, the server would reject non-admin login attempts
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to log in. Please check your credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-gold/10 p-3 rounded-full">
          <Shield className="h-8 w-8 text-gold" />
        </div>
        <h1 className="text-3xl font-bold ml-3 gold-gradient-text">
          Admin Portal
        </h1>
      </div>

      <h2 className="text-2xl font-semibold text-center mb-6">
        Sign in to Admin Dashboard
      </h2>

      {/* {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )} */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="admin@FilmCollab.com"
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

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />

            <Link
              to="/forgot-password"
              className="text-sm font-medium text-gold hover:text-gold/80"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-gold hover:bg-gold/90 text-black font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in to Admin"}
          </Button>
        </form>
      </Form>

      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Return to{" "}
          <Link
            to="/login"
            className="text-gold hover:text-gold/80 font-medium"
          >
            User Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginForm;
