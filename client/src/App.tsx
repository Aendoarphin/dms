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

import { useEffect, useState } from "react";
import { AuthEventContext } from "./context/AuthEventContext";
import { AdminContext } from "./context/AdminContext";
import { UserContext } from "./context/UserContext";
import type {
  AuthChangeEvent,
  PostgrestSingleResponse,
  User,
} from "@supabase/supabase-js";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [admins, setAdmins] = useState<any[] | null>([]);
  const [authEvent, setAuthEvent] = useState<AuthChangeEvent | null>(null);

  const navigate = useNavigate();

  // Effect to fetch user
useEffect(() => {
  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };
  fetchUser();
}, []);

// Effect to fetch admins
useEffect(() => {
  const fetchAdmins = async () => {
    const { data: users }: PostgrestSingleResponse<any[]> = await supabase
      .from("administrators")
      .select("*");
    setAdmins(users);
  };
  fetchAdmins();
}, []);

// Effect to handle navigation
useEffect(() => {
  if (!user) {
    navigate("/login");
  }
}, []);

  useEffect(() => {
    const {data: subscription} = supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      setUser(session.user);
    }
    setAuthEvent(event);
    if (event === "INITIAL_SESSION") {
      // handle initial session
    } else if (event === "SIGNED_IN") {
      // handle sign in event
      if (session) setUser(session.user)
      console.log("Signed in");
    } else if (event === "SIGNED_OUT") {
      // handle sign out event
      setUser(null);
      console.log("Signed out");
    } else if (event === "PASSWORD_RECOVERY") {
      // handle password recovery event
    } else if (event === "TOKEN_REFRESHED") {
      // handle token refreshed event
    } else if (event === "USER_UPDATED") {
      // handle user updated event
    }
  });

  // call unsubscribe to remove the callback
  
    return () => {
        subscription.subscription.unsubscribe();
    }
  }, [])
  

  return (
    <>
      <UserContext.Provider value={user}>
        <AdminContext.Provider value={admins}>
        <AuthEventContext.Provider value={authEvent}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<Search />} />
              <Route path="*" element={<NotFound />} />
              {
                // Analyze administrators table for rendering protected routes
                admins &&
                admins.find(
                  (admin) => admin.user_id === (user ? user.id : null)
                ) ? (
                  <Route path="/admin" element={<Admin />} />
                ) : null
              }
            </Route>
          </Routes>
        </AuthEventContext.Provider>
      </AdminContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default App;
