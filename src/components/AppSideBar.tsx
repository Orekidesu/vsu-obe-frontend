"use client";

import type React from "react";
import {
  LogOut,
  University,
  Users,
  LayoutDashboard,
  BookOpenText,
  ChevronDown,
  LucideUsers,
  GraduationCap,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import handleLogout from "@/app/utils/handleLogout";
import Image from "next/image";
import vsuLogo from "../../public/assets/images/vsu_logo.png";

type MenuItem = {
  title: string;
  url?: string;
  icon: React.ElementType;
  submenus?: { title: string; url: string }[];
};

const roleMenuItems: Record<string, MenuItem[]> = {
  Admin: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    {
      title: "Faculties & Departments",
      url: "/admin/faculties-departments",
      icon: University,
    },
    { title: "User Management", url: "/admin/user-management", icon: Users },
  ],
  Dean: [{ title: "Dashboard", url: "/dean/dashboard", icon: LayoutDashboard }],
  Department: [
    { title: "Dashboard", url: "/department", icon: LayoutDashboard },
    {
      title: "Programs",
      icon: BookOpenText,
      submenus: [
        { title: "Active Programs", url: "/department/programs/active" },
        { title: "Pending Programs", url: "/department/programs/pending" },
        { title: "Add Program", url: "/department/programs/add" },
        { title: "Archived", url: "/department/programs/archive" },
      ],
    },
    {
      title: "Courses",
      url: "/department/courses",
      icon: GraduationCap,
    },
    {
      title: "Committees",
      url: "/department/committees",
      icon: LucideUsers,
    },
    {
      title: "Settings",
      url: "/department/settings",
      icon: Settings,
    },
  ],
};

interface AppSidebarProps {
  role: string;
  session: { accessToken?: string };
}

const AppSidebar: React.FC<AppSidebarProps> = ({ role, session }) => {
  const pathname = usePathname();
  const roleBasedMenu = roleMenuItems[role] || [];

  const renderMenuItem = (item: MenuItem) => (
    <SidebarMenuItem key={item.title}>
      {"submenus" in item ? (
        <Collapsible>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="flex w-full items-center justify-between">
              <span className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                {item.title}
              </span>
              <ChevronDown className="h-4 w-4" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.submenus?.map((submenu) => (
                <SidebarMenuSubItem key={submenu.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === submenu.url}
                  >
                    <Link href={submenu.url} className="pl-6">
                      {submenu.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <SidebarMenuButton asChild isActive={pathname === item.url}>
          <Link href={item.url || "#"} className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );

  return (
    <Sidebar>
      <SidebarHeader className="pt-10">
        <div className="flex flex-col items-center justify-center gap-2 px-2">
          <Image
            src={vsuLogo || "/placeholder.svg"}
            alt="VSU logo"
            width={80}
            height={80}
            priority
          />
          <p className="font-semibold">{role}</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{roleBasedMenu.map(renderMenuItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              onClick={() =>
                session.accessToken && handleLogout(session.accessToken)
              }
            >
              <button className="flex w-full items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
