import {
  User as UserIcon,
  Home,
  BookOpen,
  Search,
  Shield,
  LogOut,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

import { useEffect, useContext, useState } from "react";
import { SessionContext } from "@/App";
import { Button } from "./ui/button";

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
  const currentSession = useContext(SessionContext);

  const [admin, setAdmin] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: "global" });
    [window.localStorage, window.sessionStorage].forEach((storage) => {
      Object.entries(storage).forEach(([key]) => {
        storage.removeItem(key);
      });
    });
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const getAdmins = async () => {
      const { data, error } = await supabase.from("administrators").select("*");

      if (error) {
        console.error("Error fetching admins:", error);
        return [];
      }

      return data.find((admin) => admin.user_id === currentSession?.user.id)
        ? data[0].user_id
        : [];
    };
    getAdmins().then((targetAdmin) => {
      setAdmin(targetAdmin);
    });
  }, []);

  return (
    <>
      <Sidebar className="max-w-min">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-nowrap">
              Logo Company Name
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={
                        item.title === "Admin" &&
                        currentSession?.user.id !== admin
                          ? "hidden"
                          : ""
                      }
                    >
                      {item.title === "Logout" ? (
                        <Dialog modal>
                          <DialogTrigger asChild>
                            <div className="flex items-center gap-2 w-full py-2 px-3 hover:bg-muted rounded-md cursor-pointer">
                              <item.icon size={16} />
                              <span>Logout</span>
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Logout</DialogTitle>
                              <DialogDescription>
                                Do you wish to log out? Any unsaved changes will
                                be lost.
                              </DialogDescription>
                            </DialogHeader>
                            <Button
                              variant={"destructive"}
                              onClick={handleLogout}
                              type="button"
															className="cursor-pointer" // continue here
                            >
                              Logout
                            </Button>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Link
                          to={item.url}
                          className="flex items-center gap-2 w-full py-2 px-3 hover:bg-muted rounded-md"
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
