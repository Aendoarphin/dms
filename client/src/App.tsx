import "./App.css";
import { Routes, Route, useNavigate } from "react-router";
import supabase from "./util/supabase";

import Articles from "./components/Articles";
import Home from "./components/Home";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import Admin from "./components/Admin";
import Layout from "./layout";
import Search from "./components/Search";
import Login from "./components/Login";

import { UserContext } from "./context/context";

import { useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

function App() {
  const [user, setUser] = useState<User | null>(useContext(UserContext));
  const [admins, setAdmins] = useState<User[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
    const fetchAdmins = async () => {
      const { data: users }: any = await supabase
        .from("administrators")
        .select("*");
      setAdmins(users);
    };
    fetchAdmins();
  }, [user]);

  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      setUser(session.user);
    }
    if (event === "INITIAL_SESSION") {
      // handle initial session
    } else if (event === "SIGNED_IN") {
      // handle sign in event
      setUser(session!.user);
    } else if (event === "SIGNED_OUT") {
      // handle sign out event
      setUser(null);
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

  if (user) {
		return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
          {
            // Analyze administrators table for rendering protected routes
            admins.find((admin) => admin.id === user!.id) ? (
              <Route path="/admin" element={<Admin />} />
            ) : null
          }
        </Route>
      </Routes>
    </>
  );
	} else {
		return (
			<>
				<Routes>
					<Route path="/login" element={<Login />} />
				</Routes>
			</>
		);
	}
}

export default App;
