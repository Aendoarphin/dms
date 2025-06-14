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

import { useEffect, useContext, useState } from "react";
import { SessionContext } from "@/App";

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
		navigate("/login");
		window.location.replace("/login");
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
									<SidebarMenuButton asChild className={item.title === "Admin" && currentSession?.user.id !== admin ? "hidden" : ""}>
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
