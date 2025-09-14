import {
	User as UserIcon,
	Home,
	BookOpen,
	Shield,
	LogOut,
	Pencil,
	File,
} from "lucide-react";

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

// Article categories
export const articleCategories = [
	{
		label: "All Article",
		value: "all",
	},
	{
		label: "Accounting",
		value: "accounting",
	},
	{
		label: "Compliance",
		value: "compliance",
	},
	{
		label: "Information Technology",
		value: "information technology",
	},
	{
		label: "Collections",
		value: "collections",
	},
	{
		label: "Human Resources",
		value: "human resources",
	},
	{
		label: "Other",
		value: "other",
	},
];

// Article sort options
export const sortOptions = [
	{ value: "newest", label: "Newest First" },
	{ value: "oldest", label: "Oldest First" },
	{ value: "title", label: "Title A-Z" },
	{ value: "author", label: "Author A-Z" },
];

// Article time filters
export const timeFilters = [
  { value: "all-time", label: "All Time" },
  { value: "last-week", label: "Last Week" },
  { value: "last-month", label: "Last Month" },
  { value: "last-quarter", label: "Last Quarter" }
];

// Default style for toaster
export const toasterStyle = {
	success: { style: { backgroundColor: "green", color: "white" } },
	error: { style: { backgroundColor: "red", color: "white" } },
};
