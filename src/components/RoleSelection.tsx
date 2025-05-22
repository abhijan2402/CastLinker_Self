import { motion } from "framer-motion";
import {
  Camera,
  Film,
  PenTool,
  VideoIcon,
  Palette,
  Music,
  HeartPulse,
  Lightbulb,
} from "lucide-react";

const RoleSelection = () => {
  const roles = [
    {
      title: "Actor",
      icon: <HeartPulse className="w-8 h-8 sm:w-10 sm:h-10 text-gold mb-4" />,
    },
    {
      title: "Director",
      icon: <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-gold mb-4" />,
    },
    {
      title: "Screenwriter",
      icon: <PenTool className="w-8 h-8 sm:w-10 sm:h-10 text-gold mb-4" />,
    },
    {
      title: "Editor",
      icon: <Film className="w-8 h-8 sm:w-10 sm:h-10 text-gold mb-4" />,
    },
    {
      title: "VFX Artist",
      icon: <Palette className="w-8 h-8 sm:w-10 sm:h-10 text-gold mb-4" />,
    },
    {
      title: "Music Composer",
      icon: <Music className="w-8 h-8 sm:w-10 sm:h-10 text-gold mb-4" />,
    },
    {
      title: "Production",
      icon: <VideoIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gold mb-4" />,
    },
    {
      title: "Other Roles",
      icon: <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 text-gold mb-4" />,
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-12 sm:py-20 px-4 bg-cinematic-dark">
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Find Your <span className="gold-gradient-text">Role</span> in the
            Industry
          </h2>
          <p className="text-sm sm:text-lg text-foreground/70 max-w-2xl mx-auto">
            FilmCollab connects all types of film industry professionals. Select
            your specialty and start building your network.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {roles.map((role, index) => (
            <motion.div key={index} className="role-card" variants={item}>
              {role.icon}
              <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2 text-center">
                {role.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default RoleSelection;
