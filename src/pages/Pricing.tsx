import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Pricing = () => {
  const planFeatures: any = {
    free: {
      type: "Free",
      price: "0",
      features: [
        "Create up to 2 projects per month",
        "Send up to 5 chat messages monthly",
        "Apply to 5 job opportunities each month",
        "Send 3 connection requests",
        "Share up to 5 posts per month",
      ],
    },
    professional: {
      type: "professional",
      price: "499",
      features: [
        "Create up to 5 projects per month",
        "Send up to 10 chat messages monthly",
        "Apply to 10 job opportunities each month",
        "Get early access to casting calls",
        "Send 10 connection requests",
        "Share up to 10 posts per month",
      ],
    },
    premium: {
      type: "premium",
      price: "999",
      features: [
        "Create up to 15 projects per month",
        "Send up to 15 chat messages monthly",
        "Apply to 20 job opportunities each month",
        "Send 30 connection requests",
        "Share up to 35 posts per month",
      ],
    },
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
              {/* Free Plan */}
              <div className="bg-card-gradient border border-gold/10 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {planFeatures.free.type}
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    Perfect for newcomers
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      ₹{planFeatures.free.price}
                    </span>
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
                    {planFeatures.free.features.map((feature, index) => (
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
                  <h3 className="text-xl font-bold mb-2">
                    {planFeatures.professional.type}
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    For serious film professionals
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      ₹{planFeatures.professional.price}
                    </span>
                    <span className="text-foreground/70">/month</span>
                  </div>

                  <Button className="w-full bg-gold hover:bg-gold-dark text-cinematic">
                    Get Professional
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-cinematic-dark/30 p-6">
                  <p className="font-medium mb-4">Everything in Free, plus:</p>
                  <ul className="space-y-3">
                    {planFeatures.professional.features.map(
                      (feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-gold mr-2 shrink-0" />
                          <span className="text-sm text-foreground/90">
                            {feature}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="bg-card-gradient border border-gold/10 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {planFeatures.premium.type}
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    For industry leaders
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      ₹{planFeatures.premium.price}
                    </span>
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
                  <p className="font-medium mb-4">
                    Everything in Professional, plus:
                  </p>
                  <ul className="space-y-3">
                    {planFeatures.premium.features.map((feature, index) => (
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
              {/* Free Plan */}
              <div className="bg-card-gradient border border-gold/10 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {planFeatures.free.type}
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    Perfect for newcomers
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      ₹{planFeatures.free.price}
                    </span>
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
                    {planFeatures.free.features.map((feature, index) => (
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
                  <h3 className="text-xl font-bold mb-2">
                    {planFeatures.professional.type}
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    For serious film professionals
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      ₹{planFeatures.professional.price}
                    </span>
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
                    {planFeatures.professional.features.map(
                      (feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-gold mr-2 shrink-0" />
                          <span className="text-sm text-foreground/90">
                            {feature}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="bg-card-gradient border border-gold/10 rounded-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {planFeatures.premium.type}
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    For industry leaders
                  </p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      ₹{planFeatures.premium.price}
                    </span>
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
                  <p className="font-medium mb-4">
                    Everything in Professional, plus:
                  </p>
                  <ul className="space-y-3">
                    {planFeatures.premium.features.map((feature, index) => (
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
