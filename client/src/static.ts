import { User as UserIcon, Home, BookOpen, Shield, LogOut, Pencil } from "lucide-react";

// sidebar items
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
		title: "Logout",
		url: "login",
		icon: LogOut,
	},
];