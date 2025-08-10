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

const adminItems = ["Users", "Editor"];

export function AppSidebar() {
	const [currentUser] = useState(
		JSON.parse(localStorage.getItem(import.meta.env.VITE_COOKIE) || "")
	);

	const navigate = useNavigate();
	const adminId = useGetAdmin(currentUser);

	const handleLogout = async () => {
		await supabase.auth.signOut({ scope: "global" });
		[window.localStorage, window.sessionStorage].forEach((storage) => {
			Object.entries(storage).forEach(([key]) => {
				storage.removeItem(key);
			});
		});
		navigate("/login", { replace: true });
	};

	return (
		<Sidebar className="max-w-min">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="text-nowrap">Logo Company Name</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{menuItems.map((item) => {
								if (adminItems.includes(item.title) && currentUser.user.id !== adminId) {
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
															<DialogTitle>Confirm Logout</DialogTitle>
															<DialogDescription>
																Do you wish to log out? Any unsaved changes will be lost.
															</DialogDescription>
														</DialogHeader>
														<Button
															variant="destructive"
															onClick={handleLogout}
															type="button"
															className="cursor-pointer"
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
