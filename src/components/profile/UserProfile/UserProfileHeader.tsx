import { Twitter, Instagram, Linkedin, Youtube, Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { baseURL, fetchData } from "../../../api/ClientFuntion";

import { useEffect, useState } from "react";

const UserProfileHeader = ({ userProfile }) => {
  return (
    <div className="rounded-xl bg-card-gradient border border-gold/10 overflow-hidden">
      {/* Cover Image */}
      <div
        className="h-48 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${baseURL}${userProfile?.cover_pic_url})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-cinematic to-transparent"></div>
      </div>

      {/* Profile Info */}
      <div className="p-6 relative">
        {/* Avatar - positioned to overlap with cover */}
        <Avatar className="h-28 w-28 border-4 border-card absolute -top-16 left-6">
          <AvatarImage
            src={`${baseURL}${userProfile?.cover_pic_url}`}
            alt={userProfile?.username}
          />
          <AvatarFallback className="bg-cinematic-light text-2xl capitalize">
            {userProfile?.username?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>

        {/* Profile Details */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold capitalize">
              {userProfile?.username || "User"}
            </h1>
            {!userProfile?.verified && (
              <span className="bg-gold/20 text-gold px-2 py-0.5 rounded-full text-xs font-medium">
                Verified
              </span>
            )}
            {userProfile?.availableForWork && (
              <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs font-medium">
                Available for Work
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-2">
            <p className="text-foreground/70 capitalize">
              {userProfile?.email}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-foreground/70 capitalize">
              {userProfile?.user_type}
            </p>
            <p className="text-foreground/70">
              {userProfile?.location || "NA"}
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-3 mt-4">
            <a
              href={`${userProfile?.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-gold transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href={`${userProfile?.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-gold transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={`${userProfile?.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-gold transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={`${userProfile?.youtube}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-gold transition-colors"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>

          <div className="flex gap-8 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {userProfile?.total_connections || "0"}
              </p>
              <p className="text-sm text-foreground/60">Connections</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {userProfile?.total_likes || "0"}
              </p>
              <p className="text-sm text-foreground/60">Likes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
