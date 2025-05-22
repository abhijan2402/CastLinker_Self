import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Check,
  Star,
  Users,
  Film,
  Award,
  MessageCircle,
  Briefcase,
  Shield,
} from "lucide-react";

const Features = () => {
  const featuresList = [
    {
      title: "Professional Profiles",
      description:
        "Create a stunning portfolio showcasing your work, skills, and experience to stand out in the industry.",
      icon: <Users className="h-12 w-12 text-gold" />,
    },
    {
      title: "Casting Opportunities",
      description:
        "Access exclusive casting calls and job listings tailored to your skills and preferences.",
      icon: <Film className="h-12 w-12 text-gold" />,
    },
    {
      title: "Verification System",
      description:
        "Get verified to establish credibility and trust with potential collaborators and employers.",
      icon: <Shield className="h-12 w-12 text-gold" />,
    },
    {
      title: "Networking Tools",
      description:
        "Connect with like-minded professionals and industry experts to expand your network.",
      icon: <MessageCircle className="h-12 w-12 text-gold" />,
    },
    {
      title: "Job Marketplace",
      description:
        "Find or post jobs for your next production with our comprehensive job marketplace.",
      icon: <Briefcase className="h-12 w-12 text-gold" />,
    },
    {
      title: "Recognition & Awards",
      description:
        "Showcase your achievements and get recognized for your exceptional work in the industry.",
      icon: <Award className="h-12 w-12 text-gold" />,
    },
  ];

  return (
    <div className="min-h-screen bg-cinematic text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 gold-gradient-text">
            Platform Features
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Everything you need to succeed in the film industry, all in one
            place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className="bg-card-gradient border border-gold/10 rounded-xl p-6 hover:border-gold/30 transition-all"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-card-gradient border border-gold/10 rounded-xl p-8 lg:p-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Compare Plans</h2>
              <p className="text-foreground/80 mb-8">
                Choose the plan that's right for you and take your film career
                to the next level.
              </p>
              <Link to="/pricing">
                <Button className="bg-gold hover:bg-gold-dark text-cinematic">
                  View Pricing Details
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Check className="text-gold" />
                <span>Advanced profile customization options</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-gold" />
                <span>Priority listing in search results</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-gold" />
                <span>Early access to exclusive casting calls</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-gold" />
                <span>Unlimited messaging with industry professionals</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-gold" />
                <span>AI-powered portfolio optimization tools</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-gold" />
                <span>Access to industry learning resources</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join FilmCollab?</h2>
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Join thousands of film professionals who are already using
            FilmCollab to advance their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gold hover:bg-gold-dark text-cinematic"
              >
                <Star className="mr-2 h-4 w-4" />
                Sign Up Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-gold/30 hover:border-gold"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Features;
