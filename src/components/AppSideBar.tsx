"use client";

import {
  LogOut,
  University,
  Target,
  Users,
  LayoutDashboard,
  BookOpenText,
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
  SidebarProvider,
} from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import handleSignout from "@/app/utils/handleSignout";
import { url } from "inspector";

const roleMenuItems = {
  Admin: [
    { title: "Vision & Mission", url: "/admin/vision-mission", icon: Target },
    {
      title: "College & Departments",
      url: "/admin/colleges-departments",
      icon: University,
    },
    { title: "User Management", url: "/admin/user-management", icon: Users },
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

const AppSidebar = () => {
  const pathname = usePathname();
  const { session } = useAuth();

  if (!session) {
    return null;
  }
  const role = (session as any).Role as keyof typeof roleMenuItems;
  const roleBasedMenu = roleMenuItems[role] || [];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center gap-2 px-2">
          <span className="font-semibold">{role}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {roleBasedMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {"submenus" in item ? (
                    <div>
                      <SidebarMenuButton className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      <SidebarGroupContent className="pl-4">
                        {item.submenus?.map(
                          (submenu: { title: string; url: string }) => (
                            <SidebarMenuItem key={submenu.title}>
                              <Link
                                href={submenu.url}
                                className="flex items-center gap-2"
                              >
                                <span>- {submenu.title}</span>
                              </Link>
                            </SidebarMenuItem>
                          )
                        )}
                      </SidebarGroupContent>
                    </div>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.url}
                        >
                          <Link
                            href={item.url || "#"}
                            className="flex items-center gap-2"
                          >
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
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pb-20">
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton asChild>
                  <button
                    className="flex w-full items-center gap-2"
                    onClick={() => handleSignout((session as any).accessToken)}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={20}>
                Logout
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
