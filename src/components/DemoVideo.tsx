import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoVideoProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoVideo = ({ isOpen, onClose }: DemoVideoProps) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl bg-cinematic-dark">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl gold-gradient-text">
              FilmCollab Demo
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-foreground/70 hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <DialogDescription>
            See how FilmCollab connects talent with opportunity in the film
            industry
          </DialogDescription>
        </DialogHeader>

        <div className="aspect-video bg-black/20 rounded-md overflow-hidden w-full">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
            title="FilmCollab Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoVideo;
