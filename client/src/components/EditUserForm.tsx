import { useState } from "react";
import { ArrowLeft, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate, useSearchParams } from "react-router";
import { toast, Toaster } from "sonner";
import axios from "axios";
import supabase from "@/util/supabase";

export default function EditUserForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  // Store initial values
  const initialValues = {
    firstName: searchParams.get("first")?.toString(),
    lastName: searchParams.get("last")?.toString(),
    email: searchParams.get("email")?.toString(),
    role: searchParams.get("role")?.toString(),
    password: "",
  };

  const [formData, setFormData] = useState(initialValues);

  // Check if any field has changed from initial values
  const hasChanges = () => {
    return (
      formData.firstName !== initialValues.firstName ||
      formData.lastName !== initialValues.lastName ||
      formData.email !== initialValues.email ||
      formData.role !== initialValues.role ||
      formData.password !== ""
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    };

    // Edit the user
    try {
      setLoading(true);

      interface InputBody {
        email?: string | null;
        user_metadata: {
          firstName?: string | null;
          lastName?: string | null;
          role?: string | null;
        };
      }

      const inputBody: InputBody = { user_metadata: {} };

      if (formData.firstName !== initialValues.firstName) {
        inputBody.user_metadata.firstName = formData.firstName;
      }
      if (formData.lastName !== initialValues.lastName) {
        inputBody.user_metadata.lastName = formData.lastName;
      }
      if (formData.email !== initialValues.email) {
        inputBody.email = formData.email;
      }
      if (formData.role !== initialValues.role) {
        inputBody.user_metadata.role = formData.role;
      }

      const editUserRes = await axios.put(`https://gxjoufckpcmbdieviauq.supabase.co/functions/v1/user/${searchParams.get("id")}`, inputBody, config);

      let insertAdminRes = null;
      let deleteAdminRes = null;

      // If a new role was provided, update the user's role in the administrators table
      if (editUserRes.status === 200 && formData.role !== initialValues.role) {
        if (inputBody.user_metadata.role === "admin") {
          insertAdminRes = await supabase.from("administrators").insert({
            user_id: searchParams.get("id"),
          });
        } else if (inputBody.user_metadata.role !== "admin") {
          deleteAdminRes = await supabase
            .from("administrators")
            .delete()
            .match({ user_id: searchParams.get("id") });
        }
      }

      // If a new password was provided, update the user's password
      if (formData.password !== "") {
        const updatePasswordRes = await axios.put(`https://gxjoufckpcmbdieviauq.supabase.co/functions/v1/user/${searchParams.get("id")}`, { password: formData.password }, config);

        console.log(updatePasswordRes.data.user.id);

        if (updatePasswordRes.data.error) {
          toast.error("Error updating password: " + updatePasswordRes.data.error, {
            style: { backgroundColor: "red", color: "white" },
          });
          return;
        }
      }

      const timerDuration = 5000;

      if (!insertAdminRes?.error || !deleteAdminRes?.error) {
        toast.success("User updated successfully, redirecting in " + timerDuration / 1000 + " seconds", {
          style: { backgroundColor: "green", color: "white" },
          duration: timerDuration,
        });
        // Wait 5 seconds before redirecting
        await new Promise((resolve) => setTimeout(resolve, timerDuration));
        navigate("/users");
      }
    } catch (error) {
      toast.error("Something went wrong: " + error, {
        style: { backgroundColor: "red", color: "white" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster duration={5000} position="bottom-right" />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Button variant="ghost" size="sm" onClick={() => navigate("/users")} className="p-2 h-auto">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
              <h1 className="text-2xl font-bold">Edit User</h1>
              <p className="text-muted-foreground">Modify user information</p>
            </div>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Edit3 className="h-5 w-5" />
                <CardTitle>User Information</CardTitle>
              </div>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveChanges} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" type="text" placeholder="Enter first name" value={formData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" type="text" placeholder="Enter last name" value={formData.lastName} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Enter email address" value={formData.email} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter New Password"
                    onChange={handleInputChange}
                    minLength={8}
                    pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
                    title="Must contain at least 8 characters, one uppercase letter, one number and one special character"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/users")}>
                    <ArrowLeft className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!hasChanges()} className="cursor-pointer">
                    {loading ? (
                      <>
                        <div className="animate-pulse animation-duration-1000">Submitting...</div>
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
