import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useContext, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { SessionContext } from "@/context";
import supabase from "@/util/supabase";
import { toast, Toaster } from "sonner";
import { passwordMinLength, passwordPattern, passwordTitle } from "@/global";

export default function Profile() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userEmail] = useState<string | undefined>(useContext(SessionContext)?.user.email);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailConfirmationDAte] = useState<string | null>(JSON.parse(localStorage.getItem(import.meta.env.VITE_COOKIE) || "").user.email_confirmed_at);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error(error.message, {
        style: { backgroundColor: "red", color: "white" },
      });
    } else {
      toast.success("Password updated successfully", {
        style: { backgroundColor: "green", color: "white" },
      });
    }

    setNewPassword("");
    setConfirmPassword("");

    (document.getElementById("new-password") as HTMLInputElement).value = "";
    (document.getElementById("confirm-password") as HTMLInputElement).value = "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster duration={5000} position="bottom-right" />
      {/* Main Content */}
      <div className="p-6 lg:p-8">
        <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex flex-col space-y-4">
            <div>
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Manage your account settings and security</p>
            </div>
          </div>

          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <CardDescription>Your account details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Email Address</Label>
                    <p className="text-sm text-muted-foreground mt-1">{userEmail}</p>
                  </div>
                  <Badge variant={emailConfirmationDAte === null ? "destructive" : "secondary"}>{emailConfirmationDAte === null ? "Not Verified" : "Verified"}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <CardTitle>Change Password</CardTitle>
              </div>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={(e) => handleUpdatePassword(e)}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        className="pr-10"
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={passwordMinLength}
                        pattern={passwordPattern}
                        title={passwordTitle}
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}>
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showNewPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        className="pr-10"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={passwordMinLength}
                        pattern={passwordPattern}
                        title={passwordTitle}
                        autoComplete="confirm-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 sm:flex-none"
                    disabled={newPassword !== confirmPassword || newPassword === "" || confirmPassword === "" || newPassword.includes(" ") || confirmPassword.includes(" ")}>
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Security tip:</strong> Use a strong password that includes a mix of letters, numbers, and special characters. Avoid using personal information or common
              words.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
