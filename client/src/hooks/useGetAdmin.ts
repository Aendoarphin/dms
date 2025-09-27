import { useEffect, useState } from "react";
import supabase from "@/util/supabase";

// Gets ID of current admin
export default function useGetAdmin(currentUser: { user: { id: string } }) {
	const [adminId, setAdminId] = useState<string | null>(null);

	useEffect(() => {
		const getAdmin = async () => {
			const { data, error } = await supabase.from("administrators").select("*");

			if (error) {
				console.error("Error fetching admins:", error);
				return [];
			}

			if (data) {
				setAdminId(data.find((admin) => admin.user_id === currentUser.user.id)?.user_id);
			}
		};

		getAdmin();
	}, [currentUser.user.id]);
	return adminId;
}
