import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import supabase from "@/util/supabase";
import { Info } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast, Toaster } from "sonner";

export function Login() {
  const [userCred, setUserCred] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: userCred.email,
      password: userCred.password,
    });
    if (error) {
      toast.error(error.message, {style: {backgroundColor: "red", color: "white"}});
      setUserCred({ email: "", password: "" });
      (document.getElementById("email") as HTMLInputElement).value = "";
      (document.getElementById("password") as HTMLInputElement).value = "";
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <Toaster duration={5000} position="top-right" />
        <Card className="mx-auto mt-[25vh] max-w-xs container">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Login{" "}
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Info className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="pb-1">
                    Contact your administrator to register an account.
                  </p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="firstlast@company.com"
                    required
                    onChange={(e) =>
                      setUserCred({ ...userCred, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    onKeyUp={(e) => (e.key === "Enter" ? handleLogin(e) : null)}
                    id="password"
                    type="password"
                    required
                    onChange={(e) =>
                      setUserCred({ ...userCred, password: e.target.value })
                    }
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button onClick={handleLogin} type="submit" className="w-full cursor-pointer">
              Login
            </Button>
          </CardFooter>
        </Card>
    </>
  );
}

export default Login;
