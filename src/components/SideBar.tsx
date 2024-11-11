import { Button } from "@/components/ui/button";
import { LayoutDashboard, LucideIcon, Menu, Settings, User2, Users } from "lucide-react";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Link } from "react-router-dom";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Route {
  name: string;
  path: string;
  icon: LucideIcon;
}

const routes: Route[] = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Students", path: "/students", icon: Users },
  { name: "Teachers", path: "/teachers", icon: Users },
  {name: "Subjects", path: "/subjects", icon: Users},
  { name: "Profile", path: "/profile", icon: User2 },
  { name: "Settings", path: "/settings", icon: Settings },
];

export const SideBar: React.FC<SideBarProps> = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`bg-primary text-primary-foreground w-64 min-h-screen p-4 ${
        isOpen ? "block" : "hidden"
      } md:block`}
    >
      <div className="flex items-center justify-between mb-6">
        <span className="text-2xl font-semibold">Dashboard</span>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onClose}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <div className="h-full bg-primary text-primary-foreground">
        <ScrollArea className="h-[calc(100vh-4rem)] pb-10">
          <nav className="space-y-2 px-2">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <route.icon className="h-5 w-5" />
                <span>{route.name}</span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
};
