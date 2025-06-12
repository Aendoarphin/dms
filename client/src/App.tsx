import "./App.css";
import { Routes, Route, useNavigate } from "react-router";
import supabase from "./util/supabase";

import Articles from "./components/Articles";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Admin from "./components/Admin";
import Layout from "./layout";
import Search from "./components/Search";
import Login from "./components/Login";

import { useEffect, useState } from "react";
import { type Session } from "@supabase/supabase-js";

function App() {
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session]);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        console.log({ event, session });
        if (event === "INITIAL_SESSION") {
          // handle initial session
        } else if (event === "SIGNED_IN") {
          // handle sign in event
        } else if (event === "SIGNED_OUT") {
          // handle sign out event
          window.alert("Signed out");
        } else if (event === "PASSWORD_RECOVERY") {
          // handle password recovery event
        } else if (event === "TOKEN_REFRESHED") {
          // handle token refreshed event
        } else if (event === "USER_UPDATED") {
          // handle user updated event
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        {session !== null && (
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="articles" element={<Articles />} />
            <Route path="profile" element={<Profile />} />
            <Route path="search" element={<Search />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        )}
      </Routes>
    </>
  );
}

export default App;
