import {
  User as UserIcon,
  Home,
  BookOpen,
  Shield,
  LogOut,
  Pencil,
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

import { useEffect, useState } from "react";
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
    title: "My Profile",
    url: "profile",
    icon: UserIcon,
  },
  {
    title: "Users",
    url: "users",
    icon: Shield,
  },
  {
    title: "Editor",
    url: "editor",
    icon: Pencil,
  },
  {
    title: "Logout",
    url: "/login",
    icon: LogOut,
  },
];

const adminItems = ["Users", "Editor"];

export function AppSidebar() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState<string | null>(null);
  const [currentUser] = useState(
    JSON.parse(
      localStorage.getItem(import.meta.env.VITE_COOKIE) ||
        ""
    )
  );

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: "global" });
    [window.localStorage, window.sessionStorage].forEach(
      (storage) => {
        Object.entries(storage).forEach(([key]) => {
          storage.removeItem(key);
        });
      }
    );
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const getAdmin = async () => {
      const { data, error } = await supabase
        .from("administrators")
        .select("*");

      if (error) {
        console.error("Error fetching admins:", error);
        return [];
      }

      setAdmin(
        data.find(
          (admin) => admin.user_id === currentUser.user.id
        ).user_id
      );
    };

    getAdmin();
  }, [navigate, admin]);

  return (
    <Sidebar className="max-w-min">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-nowrap">
            Logo Company Name
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (
                  adminItems.includes(item.title) &&
                  currentUser.user.id !== admin
                ) {
                  return null;
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
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
                              <DialogTitle>
                                Confirm Logout
                              </DialogTitle>
                              <DialogDescription>
                                Do you wish to log out? Any
                                unsaved changes will be
                                lost.
                              </DialogDescription>
                            </DialogHeader>
                            <Button
                              variant="destructive"
                              onClick={handleLogout}
                              type="button"
                              className="cursor-pointer">
                              Logout
                            </Button>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Link
                          to={item.url}
                          className="flex items-center gap-2 w-full py-2 px-3 hover:bg-muted rounded-md">
                          <item.icon size={16} />
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
