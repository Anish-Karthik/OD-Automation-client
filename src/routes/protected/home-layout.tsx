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
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SideBar isOpen={true} onClose={() => {}} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SideBar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <TopBar onMenuClick={toggleSidebar} /> */}

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
