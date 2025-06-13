import {
  User as UserIcon,
  Home,
  BookOpen,
  Search,
  Shield,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import supabase from "@/util/supabase";
import { useNavigate, Link } from "react-router";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Articles",
    url: "articles",
    icon: BookOpen,
  },

  {
    title: "Search",
    url: "search",
    icon: Search,
  },
  {
    title: "User Profile",
    url: "profile",
    icon: UserIcon,
  },
  {
    title: "Admin",
    url: "admin",
    icon: Shield,
  },
  {
    title: "Logout",
    url: "/login",
    icon: LogOut,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut({scope: "global"});
		[
      window.localStorage,
      window.sessionStorage,
    ].forEach((storage) => {
      Object.entries(storage)
        .forEach(([key]) => {
          storage.removeItem(key)
        })
    })
		navigate("/login");
    window.location.replace("/login"); // continue here; last action was clearing the browser history
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Logo Company Name</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={""}>
                    <Link
                      to={item.url}
                      onClick={() =>
                        item.title === "Logout" ? handleLogout() : null
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
