import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const sb = createClient(
	process.env.SUPABASE_URL as string,
	process.env.SUPABASE_SERVICE_ROLE_KEY as string,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	}
);

export { sb };
