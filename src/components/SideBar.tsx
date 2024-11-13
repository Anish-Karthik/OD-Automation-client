import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  LucideIcon,
  Menu,
  Settings,
  User2,
  Users,
  BookOpen,
  BarChart2,
  Upload
} from "lucide-react";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Route {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface RouteGroup {
  name: string;
  routes: Route[];
}

const routeGroups: RouteGroup[] = [
  {
    name: "OD Management",
    routes: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "Students", path: "/students", icon: Users },
      { name: "Teachers", path: "/teachers", icon: Users },
    ],
  },
  {
    name: "Result Analysis",
    routes: [
      { name: "Subjects", path: "/subjects", icon: BookOpen },
      { name: "Result Upload", path: "/result-upload", icon: Upload },
      { name: "Analysis", path: "/analysis", icon: BarChart2 },
    ],
  },
];

const otherRoutes: Route[] = [
  // { name: "Profile", path: "/profile", icon: User2 },
  // { name: "Settings", path: "/settings", icon: Settings },
];

export const SideBar: React.FC<SideBarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <aside
      className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 min-h-screen p-4 ${
        isOpen ? "block" : "hidden"
      } md:block`}
    >
      <div className="flex items-center justify-between mb-6">
        <span className="text-2xl font-semibold text-yellow-400">OD Management</span>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:text-yellow-400"
          onClick={onClose}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)] pb-10">
        <nav className="space-y-6">
          {routeGroups.map((group) => (
            <div key={group.name}>
              <h3 className="mb-2 px-3 text-sm font-semibold text-gray-300">
                {group.name}
              </h3>
              <ul className="space-y-1">
                {group.routes.map((route) => (
                  <li key={route.path}>
                    <Link
                      to={route.path}
                      className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm ${
                        location.pathname === route.path
                          ? "bg-gray-700 text-yellow-400 font-medium"
                          : "text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
                      }`}
                    >
                      <route.icon className="h-4 w-4" />
                      <span>{route.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <ul className="space-y-1">
              {otherRoutes.map((route) => (
                <li key={route.path}>
                  <Link
                    to={route.path}
                    className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm ${
                      location.pathname === route.path
                        ? "bg-gray-700 text-yellow-400 font-medium"
                        : "text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
                    }`}
                  >
                    <route.icon className="h-4 w-4" />
                    <span>{route.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </ScrollArea>
    </aside>
  );
};