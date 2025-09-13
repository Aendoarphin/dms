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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import useGetAdmin from "@/hooks/useGetAdmin";
import { menuItems } from "@/static";

const adminItems = ["Users", "Editor", "Files"];

export function AppSidebar() {
  const [currentUser] = useState(
    JSON.parse(localStorage.getItem(`sb-${import.meta.env.VITE_SUPABASE_PROJECT_ID}-auth-token`) || "")
  );
  const [active, setActive] = useState(menuItems[0].title);
  const [companyName] = useState(import.meta.env.VITE_COMPANY_NAME);

  const navigate = useNavigate();
  const adminId = useGetAdmin(currentUser);

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: "global" });
    localStorage.removeItem(`sb-${import.meta.env.VITE_SUPABASE_PROJECT_ID}-auth-token`);
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar className="max-w-min">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-nowrap flex items-center gap-2 flex-row">
            <img src="/companylogo.svg" className="max-w-4" alt="Logo" />{" "}
            <p>{companyName}</p>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                if (
                  adminItems.includes(item.title) &&
                  currentUser.user.id !== adminId
                ) {
                  return null;
                }

                return (
                  <SidebarMenuItem
                    className={
                      item.title === active && item.title !== "Logout"
                        ? " border-l-2 border-primary md:w-96"
                        : ""
                    }
                    key={item.title}
                    onClick={() => setActive(item.title)}
                  >
                    <SidebarMenuButton className="rounded-none" asChild>
                      {item.title === "Logout" ? (
                        <Dialog modal>
                          <DialogTrigger asChild>
                            <div className="flex items-center gap-2 w-full py-2 px-3 hover:bg-muted rounded-md cursor-pointer text-destructive">
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
                              variant="destructive"
                              onClick={handleLogout}
                              type="button"
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
