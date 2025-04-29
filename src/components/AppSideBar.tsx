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
import { Session } from "@/app/api/auth/[...nextauth]/authOptions";

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
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
  Dean: [{ title: "Dashboard", url: "/dean/dashboard", icon: LayoutDashboard }],
  Department: [
    { title: "Dashboard", url: "/department", icon: LayoutDashboard },
    {
      title: "Programs",
      icon: BookOpenText,
      submenus: [
        { title: "All Programs", url: "/department/programs/all-programs" },
        { title: "Archived", url: "/department/programs/archive" },
      ],
    },
    {
      title: "Manage Courses",
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
  Faculty_Member: [
    { title: "Dashboard", url: "/faculty", icon: LayoutDashboard },
    {
      title: "Syllabi",
      icon: BookOpenText,
      submenus: [
        { title: "All Syllabi", url: "/faculty/syllabi/all-syllabi" },
        { title: "Archived", url: "/faculty/syllabi/archive" },
      ],
    },
    {
      title: "Manage Courses",
      url: "/faculty/courses",
      icon: GraduationCap,
    },
    {
      title: "Settings",
      url: "/faculty/settings",
      icon: Settings,
    },
  ],
};

interface AppSidebarProps {
  role: string;
  session: Session;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ role, session }) => {
  const pathname = usePathname();
  const roleBasedMenu = roleMenuItems[role] || [];

  // Generate personalized display info based on role
  const getPersonalizedDisplay = () => {
    if (role === "Admin") {
      return (
        <div className="flex flex-col items-center text-center">
          <p className="font-semibold">Admin</p>
        </div>
      );
    } else if (role === "Dean" && session.Faculty) {
      return (
        <div className="flex flex-col items-center text-center">
          <p className="font-semibold">{`Dean`}</p>
          <p className="text-sm font-thin pt-2 ">{`${session.Faculty.name}`}</p>
        </div>
      );
    } else if (role === "Department" && session.Department) {
      return (
        <div className="flex flex-col items-center text-center">
          <p className="font-semibold">{`Department`}</p>
          <p className="text-sm font-thin pt-2 ">
            {`${session.Department.name}`}
          </p>
          <p className="text-sm font-thin ">{` (${session.Department.abbreviation})`}</p>
        </div>
      );
    } else if (role === "Faculty_Member" && session.Department) {
      return (
        <div className="flex flex-col items-center text-center">
          <p className="font-semibold">{`Faculty Member`}</p>
          <p className="text-sm font-thin pt-2 ">
            {`${session.Department.name}`}
          </p>
          <p className="text-sm font-thin ">{` (${session.Department.abbreviation})`}</p>
        </div>
      );
    }
    // Fallback if no role-specific display is available
    return (
      <div className="flex flex-col items-center text-center">
        <p className="font-semibold">{role}</p>
        {session.First_Name && session.Last_Name && (
          <p className="text-xs text-muted-foreground mt-1">
            {`${session.First_Name} ${session.Last_Name}`}
          </p>
        )}
      </div>
    );
  };

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
          {getPersonalizedDisplay()}
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
