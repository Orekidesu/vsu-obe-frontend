"use client";
import { usePathname } from "next/navigation";
import { Button } from "./ui";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  User,
  University,
  Ghost,
  Link,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "admin/dashboard", icon: LayoutDashboard },
  { name: "User Management", href: "admin/user_management", icon: User },
  {
    name: "Colleges & Department",
    href: "admin/college_department",
    icon: University,
  },
];

interface SidePanelProps {
  isOpen: boolean;
  setIsOpenAction: (isOpen: boolean) => void;
}

export function UserNavigation({ isOpen, setIsOpenAction }: SidePanelProps) {
  const pathName = usePathname();
  return (
    <div className="text-black">
      <Button
        variant="ghost"
        className=" fixt top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpenAction(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>
      <div
        className={`fixed top-0 left-0 h-full bg-background border-r transition-all duration-300 ease-in-out z-40 
          ${isOpen ? "w-64" : "w-0 lg:w-64"} overflow-hidden`}
      >
        <nav className="h-full flex flex-col pt-16 lg:pt-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 my-1 mx-2 rounded-md transition-colors whitespace-nowrap
                ${pathName === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              <item.icon className="mr-3 h-5 w-5"></item.icon>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
