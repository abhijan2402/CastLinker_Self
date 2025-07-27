import { Card, CardContent } from "@/components/ui/card";

const UserAboutSection = ({ userProfile }) => {
  const about = {
    bio:
      userProfile?.bio ||
      `Passionate actor with over 5 years of experience in film and theater.`,
    details: [
      { label: "Age Range", value: userProfile?.age_range || "25-35" },
      { label: "Height", value: userProfile?.height || "5'10\"" },
      { label: "Weight", value: userProfile?.weight || "160 lbs" },
      { label: "Hair Color", value: userProfile?.hair_color || "Brown" },
      { label: "Eye Color", value: userProfile?.eye_color || "Hazel" },
      {
        label: "Languages",
        value: userProfile?.languages || "English, Spanish",
      },
      {
        label: "Union Status",
        value: userProfile?.union_status || "SAG-AFTRA",
      },
      {
        label: "Representation",
        value: userProfile?.representation || "Elite Talent Agency",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card-gradient border-gold/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Biography</h3>
          </div>
          <div className="whitespace-pre-line text-foreground/80">
            {about.bio}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card-gradient border-gold/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {about.details.map((detail, index) => (
              <div key={index} className="flex">
                <div className="w-1/3 text-foreground/60">{detail.label}:</div>
                <div className="w-2/3 font-medium">{detail.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAboutSection;
