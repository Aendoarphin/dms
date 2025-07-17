import "./App.css";
import { Routes, Route, useNavigate } from "react-router";
import supabase from "./util/supabase";

import Articles from "./components/Articles";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Users from "./components/Users";
import Layout from "./layout";
import Login from "./components/Login";

import { useEffect, useState, createContext } from "react";
import { type Session } from "@supabase/supabase-js";
import NotFound from "./components/NotFound";
import Editor from "./components/Editor";
import useListenAuth from "./hooks/useListenAuth";
import AddUserForm from "./components/AddUserForm";
import EditUserForm from "./components/EditUserForm";

export const SessionContext = createContext<Session | null>(null);

function App() {
	const navigate = useNavigate();
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		// 1. Check for existing session on initial load
		const getInitialSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (session) {
				setSession(session);
			} else if (window.location.pathname !== "/login") {
				navigate("/login", { replace: true });
			}
		};

		getInitialSession();

		// 2. Listen for future auth state changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			console.log({ event, session });
			if (event === "SIGNED_OUT") {
				setSession(null);
			} else if (session) {
				setSession(session);
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [navigate]);

	useListenAuth(session?.user?.last_sign_in_at ?? "");


	return (
		<>
			<SessionContext.Provider value={session}>
				<Routes>
					<Route path="/login" element={<Login />} />
					{session !== null && (
						<Route path="/" element={<Layout />}>
							<Route index element={<Home />} />
							<Route path="articles" element={<Articles />} />
							<Route path="profile" element={<Profile />} />
							<Route path="users" element={<Users />} />
							<Route path="editor" element={<Editor />} />
							<Route path="users/new" element={<AddUserForm />} />
							<Route path="users/edit" element={<EditUserForm />} />
						</Route>
					)}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</SessionContext.Provider>
		</>
	);
}

export default App;
