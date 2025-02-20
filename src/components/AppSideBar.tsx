"use client";

import {
  LogOut,
  University,
  Target,
  Users,
  LayoutDashboard,
  BookOpenText,
  LayoutDashboardIcon,
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
import { useAuth } from "@/hooks/useAuth";
import handleSignout from "@/app/utils/handleSignout";
import Image from "next/image";
import vsuLogo from "../../public/assets/images/vsu_logo.png";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const roleMenuItems = {
  Admin: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboardIcon },
    {
      title: "College & Departments",
      url: "/admin/colleges_departments",
      icon: University,
    },
    { title: "User Management", url: "/admin/user_management", icon: Users },
  ],
  Dean: [{ title: "Dashboard", url: "dean/dashboard", icon: LayoutDashboard }],
  Department: [
    { title: "Dashboard", url: "department/dashboard", icon: LayoutDashboard },
    {
      title: "Programs",
      icon: BookOpenText,
      submenus: [
        { title: "Manage Courses", url: "department/manage-courses" },
        { title: "Assign Instructors", url: "department/assign-instructors" },
      ],
    },
  ],
};

const AppSidebar = ({
  role,
  session,
}: {
  role: keyof typeof roleMenuItems;
  session: any;
}) => {
  const pathname = usePathname();
  const roleBasedMenu = roleMenuItems[role] || [];

  return (
    <Sidebar>
      <SidebarHeader className="pt-10">
        <div className="flex flex-col items-center justify-center gap-2 px-2">
          <Image src={vsuLogo} alt="vsu logo" className="h-20 w-20"></Image>
          <p className="font-semibold">{role}</p>
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
                    <Collapsible>
                      <CollapsibleTrigger>
                        <SidebarMenuButton className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="pl-4">
                          {item.submenus?.map(
                            (submenu: { title: string; url: string }) => (
                              <SidebarMenuSubItem key={submenu.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === submenu.url}
                                >
                                  <Link
                                    href={submenu.url}
                                    className="flex items-center gap-2"
                                  >
                                    <span>- {submenu.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          )}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    // =============================End Collapsible ==============
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
