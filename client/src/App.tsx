import "./App.css";
import { Routes, Route } from "react-router";
import supabase from "./util/supabase";

import Articles from "./components/Articles";
import Home from "./components/Home";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import Admin from "./components/Admin";
import Layout from "./layout";

function App() {
	supabase.auth.onAuthStateChange((event, session) => {
		console.log(event, session);
		if (event === "INITIAL_SESSION") {
			// handle initial session
		} else if (event === "SIGNED_IN") {
			// handle sign in event
		} else if (event === "SIGNED_OUT") {
			// handle sign out event
		} else if (event === "PASSWORD_RECOVERY") {
			// handle password recovery event
		} else if (event === "TOKEN_REFRESHED") {
			// handle token refreshed event
		} else if (event === "USER_UPDATED") {
			// handle user updated event
		}
	});

	// call unsubscribe to remove the callback
	// data.subscription.unsubscribe()

	return (
		<>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/articles" element={<Articles />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="*" element={<NotFound />} />
					{
						// Analyze user_metadata.user_role for protected routes
						<Route path="/admin" element={<Admin />} />
					}
				</Route>
			</Routes>
		</>
	);
}

export default App;
