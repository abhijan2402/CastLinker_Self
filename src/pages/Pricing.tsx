import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Pricing = () => {
  const planFeatures = {
    free: [
      "Basic profile creation",
      "Browse casting calls",
      "Limited messaging (5/day)",
      "Basic search functionality",
      "Access to public forums",
    ],
    professional: [
      "Verified profile badge",
      "Priority in search results",
      "Unlimited messaging",
      "Early access to casting calls",
      "Analytics dashboard",
      "Custom portfolio page",
      "Save jobs and create alerts",
    ],
    premium: [
      "Featured profile placement",
      "AI portfolio optimization",
      "Priority customer support",
      "Exclusive industry events",
      "Advanced analytics tools",
      "Custom branding options",
      "Direct introduction to casting directors",
      "Video resume hosting",
      "Remove FilmCollab branding",
    ],
  };

  return (
    <div className="min-h-screen bg-cinematic text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gold-gradient-text">
            Affordable Plans for Every Professional
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Choose the plan that matches your career stage and goals in the film
            industry.
          </p>
        </div>

        <Tabs defaultValue="monthly" className="max-w-4xl mx-auto mb-16">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-cinematic-dark/50 border border-gold/10">
              <TabsTrigger
                value="monthly"
                className="data-[state=active]:text-gold data-[state=active]:border-gold data-[state=active]:bg-transparent border-b-2 border-transparent"
              >
                Monthly Billing
              </TabsTrigger>
              <TabsTrigger
                value="annual"
                className="data-[state=active]:text-gold data-[state=active]:border-gold data-[state=active]:bg-transparent border-b-2 border-transparent"
              >
                Annual Billing
                <span className="ml-2 bg-gold/20 text-gold py-0.5 px-2 rounded-full text-xs">
                  Save 20%
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="monthly">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="bg-card-gradient border border-gold/10 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Free</h3>
                  <p className="text-foreground/70 mb-4">
                    Perfect for newcomers
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-foreground/70">/month</span>
                  </div>
                  <Link to="/signup">
                    <Button
                      variant="outline"
                      className="w-full border-gold/30 hover:border-gold"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="bg-cinematic-dark/30 p-6">
                  <p className="font-medium mb-4">What's included:</p>
                  <ul className="space-y-3">
                    {planFeatures.free.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-gold mr-2 shrink-0" />
                        <span className="text-sm text-foreground/90">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Professional Plan */}
              <div className="bg-card-gradient border border-gold/20 rounded-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 bg-gold text-cinematic text-xs font-bold py-1 px-3">
                  MOST POPULAR
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Professional</h3>
                  <p className="text-foreground/70 mb-4">
                    For serious film professionals
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$19.99</span>
                    <span className="text-foreground/70">/month</span>
                  </div>
                  <Link to="/signup">
                    <Button className="w-full bg-gold hover:bg-gold-dark text-cinematic">
                      Get Professional
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="bg-cinematic-dark/30 p-6">
                  <p className="font-medium mb-4">Everything in Free, plus:</p>
                  <ul className="space-y-3">
                    {planFeatures.professional.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-gold mr-2 shrink-0" />
                        <span className="text-sm text-foreground/90">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="bg-card-gradient border border-gold/10 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Premium</h3>
                  <p className="text-foreground/70 mb-4">
                    For industry leaders
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$49.99</span>
                    <span className="text-foreground/70">/month</span>
                  </div>
                  <Link to="/signup">
                    <Button
                      variant="outline"
                      className="w-full border-gold/30 hover:border-gold"
                    >
                      Get Premium
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="bg-cinematic-dark/30 p-6">
                  <p className="font-medium mb-4">
                    Everything in Professional, plus:
                  </p>
                  <ul className="space-y-3">
                    {planFeatures.premium.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-gold mr-2 shrink-0" />
                        <span className="text-sm text-foreground/90">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="annual">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan (Annual) */}
              <div className="bg-card-gradient border border-gold/10 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Free</h3>
                  <p className="text-foreground/70 mb-4">
                    Perfect for newcomers
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-foreground/70">/year</span>
                  </div>
                  <Link to="/signup">
                    <Button
                      variant="outline"
                      className="w-full border-gold/30 hover:border-gold"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="bg-cinematic-dark/30 p-6">
                  <p className="font-medium mb-4">What's included:</p>
                  <ul className="space-y-3">
                    {planFeatures.free.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-gold mr-2 shrink-0" />
                        <span className="text-sm text-foreground/90">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Professional Plan (Annual) */}
              <div className="bg-card-gradient border border-gold/20 rounded-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 bg-gold text-cinematic text-xs font-bold py-1 px-3">
                  MOST POPULAR
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Professional</h3>
                  <p className="text-foreground/70 mb-4">
                    For serious film professionals
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$191.90</span>
                    <span className="text-foreground/70">/year</span>
                    <p className="text-sm text-gold mt-1">
                      $15.99/month, billed annually
                    </p>
                  </div>
                  <Link to="/signup">
                    <Button className="w-full bg-gold hover:bg-gold-dark text-cinematic">
                      Get Professional
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="bg-cinematic-dark/30 p-6">
                  <p className="font-medium mb-4">Everything in Free, plus:</p>
                  <ul className="space-y-3">
                    {planFeatures.professional.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-gold mr-2 shrink-0" />
                        <span className="text-sm text-foreground/90">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Premium Plan (Annual) */}
              <div className="bg-card-gradient border border-gold/10 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Premium</h3>
                  <p className="text-foreground/70 mb-4">
                    For industry leaders
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$479.90</span>
                    <span className="text-foreground/70">/year</span>
                    <p className="text-sm text-gold mt-1">
                      $39.99/month, billed annually
                    </p>
                  </div>
                  <Link to="/signup">
                    <Button
                      variant="outline"
                      className="w-full border-gold/30 hover:border-gold"
                    >
                      Get Premium
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="bg-cinematic-dark/30 p-6">
                  <p className="font-medium mb-4">
                    Everything in Professional, plus:
                  </p>
                  <ul className="space-y-3">
                    {planFeatures.premium.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-gold mr-2 shrink-0" />
                        <span className="text-sm text-foreground/90">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="max-w-3xl mx-auto bg-card-gradient border border-gold/10 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
          <p className="text-foreground/80 mb-6">
            We offer tailored solutions for production companies, casting
            agencies, and studios.
          </p>
          <Link to="/contact">
            <Button className="bg-gold hover:bg-gold-dark text-cinematic">
              <Star className="mr-2 h-4 w-4" />
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
