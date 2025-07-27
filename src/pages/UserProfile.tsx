import React, { useEffect, useState } from "react";
import UserProfileHeader from "@/components/profile/UserProfile/UserProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { useParams } from "react-router-dom";
import UserProfileTabs from "@/components/profile/UserProfile/UserProfileTabs";
import { fetchData } from "@/api/ClientFuntion";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [userProfile, setUserProfile] = useState<any>(null);
  console.log(id, userProfile);
  const fetchUserProfile = async (uId: any) => {
    if (!uId) return;
    try {
      const res: any = await fetchData(`auth/profile?user_id=${uId}`);
      if (res.success) {
        setUserProfile(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };
  useEffect(() => {
    fetchUserProfile(id);
  }, [id]);

  return (
    <div className="space-y-4 pr-1">
      <UserProfileHeader userProfile={userProfile} />
      <UserProfileTabs userProfile={userProfile} />
    </div>
  );
};

export default UserProfile;
