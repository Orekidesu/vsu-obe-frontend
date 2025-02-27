"use client";

import type React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LogOut,
  University,
  Users,
  LayoutDashboard,
  BookOpenText,
  ChevronDown,
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
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
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
      url: "/admin/faculties_departments",
      icon: University,
    },
    { title: "User Management", url: "/admin/user_management", icon: Users },
  ],
  Dean: [{ title: "Dashboard", url: "/dean/dashboard", icon: LayoutDashboard }],
  Department: [
    { title: "Dashboard", url: "/department/dashboard", icon: LayoutDashboard },
    {
      title: "Programs",
      icon: BookOpenText,
      submenus: [
        { title: "Manage Courses", url: "/department/manage-courses" },
        { title: "Assign Instructors", url: "/department/assign-instructors" },
      ],
    },
  ],
};

interface AppSidebarProps {
  role: keyof typeof roleMenuItems;
  session: { accessToken: string };
}

const AppSidebar: React.FC<AppSidebarProps> = ({ role, session }) => {
  const pathname = usePathname();
  const roleBasedMenu = roleMenuItems[role] || [];
  const isMobile = useIsMobile();

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
                  {isMobile ? (
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === submenu.url}
                    >
                      <Link href={submenu.url} className="pl-6">
                        {submenu.title}
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === submenu.url}
                        >
                          <Link href={submenu.url} className="pl-6">
                            {submenu.title}
                          </Link>
                        </SidebarMenuSubButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" sideOffset={40}>
                        {submenu.title}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      ) : isMobile ? (
        <SidebarMenuButton asChild isActive={pathname === item.url}>
          <Link href={item.url || "#"} className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton asChild isActive={pathname === item.url}>
              <Link href={item.url || "#"} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={20}>
            {item.title}
          </TooltipContent>
        </Tooltip>
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
            {isMobile ? (
              <SidebarMenuButton
                asChild
                onClick={() => handleLogout((session as any).accessToken)}
              >
                <button className="flex w-full items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </SidebarMenuButton>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    onClick={() => handleLogout((session as any).accessToken)}
                  >
                    <button className="flex w-full items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={20}>
                  Logout
                </TooltipContent>
              </Tooltip>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
