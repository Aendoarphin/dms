import { User as UserIcon, Home, BookOpen, Shield, LogOut, Pencil, File } from "lucide-react";

// Sidebar items
export const menuItems = [
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
		title: "Files",
		url: "files",
		icon: File,
	},
	{
		title: "Logout",
		url: "login",
		icon: LogOut,
	},
];

export const toasterStyle = {
	success: { style: { backgroundColor: "green", color: "white" } },
	error: { style: { backgroundColor: "red", color: "white" } },
}