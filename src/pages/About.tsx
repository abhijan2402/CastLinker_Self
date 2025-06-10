import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const About = () => {
  return (
    <div className="min-h-screen bg-cinematic text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 gold-gradient-text">
            About FilmCollab
          </h1>

          <div className="bg-card-gradient border border-gold/10 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-foreground/80 text-lg mb-6">
              At FilmCollab, we're revolutionizing how film industry
              professionals connect, collaborate, and create. Our platform
              bridges the gap between talent and opportunity, making the film
              industry more accessible and transparent for everyone involved.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-foreground/80 text-lg mb-6">
              Founded in 2025, FilmCollab aims to break barriers in the film
              industry by connecting talented individuals directly with
              directors and producers. As a tech-driven newcomer, I saw how
              closed networks limit opportunities. FilmCollab empowers artists
              to be discovered based on talent—not connections.
            </p>

            <div className="my-8">
              <Separator className="bg-gold/20" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="bg-cinematic-dark/50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20">
                  <span className="text-3xl text-gold">10K+</span>
                </div>
                <h3 className="font-semibold mb-2">Active Professionals</h3>
                <p className="text-foreground/70">
                  From actors to cinematographers
                </p>
              </div>

              <div className="text-center">
                <div className="bg-cinematic-dark/50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20">
                  <span className="text-3xl text-gold">500+</span>
                </div>
                <h3 className="font-semibold mb-2">Productions</h3>
                <p className="text-foreground/70">
                  Films, series, and commercials
                </p>
              </div>

              <div className="text-center">
                <div className="bg-cinematic-dark/50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20">
                  <span className="text-3xl text-gold">30+</span>
                </div>
                <h3 className="font-semibold mb-2">States</h3>
                <p className="text-foreground/70">Indian Talent Network</p>
              </div>
            </div>
          </div>

          <div className="bg-card-gradient border border-gold/10 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6">Our Team</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="h-16 w-20 rounded-full bg-cinematic-dark border border-gold/20 flex items-center justify-center">
                  <span className="text-xl font-bold">CP</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">K Chindu Prasath</h3>
                  <p className="text-gold mb-1">CEO & Co-Founder</p>
                  <p className="text-foreground/70 text-sm">
                    Building tech to connect talent and casting opportunities
                    efficiently.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-16 w-20 rounded-full bg-cinematic-dark border border-gold/20 flex items-center justify-center">
                  <span className="text-xl font-bold">CK</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">A Chandra Kama</h3>
                  <p className="text-gold mb-1">CTO & Co-Founder</p>
                  <p className="text-foreground/70 text-sm">
                    Strategizing creative ways to bridge artists with casting
                    needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
