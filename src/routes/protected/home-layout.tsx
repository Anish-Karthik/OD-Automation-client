import { useAuth } from "@/components/AuthProvider";
import { SideBar } from "@/components/SideBar";
import { TopBar } from "@/components/TopBar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function HomePageLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-600">
        <Loader className="animate-spin h-10 w-10 mb-4 text-blue-500" />
        <p className="text-lg font-medium">Loading ....</p>
      </div>
    )
  }
  console.log("user",user);
  if (!user) {
    console.log("user",user);
    navigate("/auth/login");
    // return null;
  }
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex">
        <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
