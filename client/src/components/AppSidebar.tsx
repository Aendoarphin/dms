import { User as UserIcon, Home, BookOpen, Search, Shield, LogOut } from "lucide-react";

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
import { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { AdminContext } from "@/context/AdminContext";
import supabase from "@/util/supabase";
import { AuthEventContext } from "@/context/AuthEventContext";

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
		url: "/",
		icon: LogOut,
	},
];

export function AppSidebar() {
	const [user] = useState(useContext(UserContext));
	const [admins] = useState(useContext(AdminContext));
	const [authEvent] = useState(useContext(AuthEventContext));

	const handleLogout = () => {
		supabase.auth.signOut({ scope: "global"})
	}

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
											<a href={item.url} onClick={() => item.title === "Logout" ? handleLogout() : null}>
												<item.icon />
												<span>{item.title}</span>
											</a>
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

// continue here; add logout function
