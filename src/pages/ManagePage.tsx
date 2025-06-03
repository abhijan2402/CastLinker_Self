import UserJobManagement from "@/components/manage/UserJobManagement";
import UserPostManagement from "@/components/manage/UserPostManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const ManagePage = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Manage Your Listings</h1>
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="jobs">
          <UserJobManagement />
        </TabsContent>
        <TabsContent value="posts">
          <UserPostManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagePage; 