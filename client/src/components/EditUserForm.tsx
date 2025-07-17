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

  const [formData, setFormData] = useState({
    firstName: searchParams.get("first")?.toString(),
    lastName: searchParams.get("last")?.toString(),
    email: searchParams.get("email")?.toString(),
    role: searchParams.get("role")?.toString(),
  });

  const elements = {
    firstName: document.getElementById("firstName") as HTMLInputElement,
    lastName: document.getElementById("lastName") as HTMLInputElement,
    email: document.getElementById("email") as HTMLInputElement,
    role: document.getElementById("role") as HTMLInputElement,
  }

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
    })); // continue here; validate changed values before submitting
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    };

    const formInput = {
      email: formData.email,
      user_metadata: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
      },
    };

    // Edit the user
    try {
      const editUserRes = await axios.put(
        `https://gxjoufckpcmbdieviauq.supabase.co/functions/v1/user/${searchParams.get("id")}`,
        formInput,
        config
      );

      // Insert into admin table if role is admin
      if (formData.role?.toLowerCase() === "admin") {
        const insertRes = await supabase.from("administrators").insert({
          user_id: editUserRes.data.user.id,
          created_at: editUserRes.data.user.created_at,
        });
        editUserRes;
        console.log(insertRes);
      }

      // Delete from admin table if role is not admin
      if (formData.role?.toLowerCase() !== "admin") {
        const deleteRes = await supabase.from("administrators").delete().eq("user_id", editUserRes.data.user.id);
        console.log(deleteRes);
      }

      // Set user metadata
      if (editUserRes.status === 201 && editUserRes.data.user) {
        const setUserMetadataRes = await axios.put(
          `https://gxjoufckpcmbdieviauq.supabase.co/functions/v1/user/${editUserRes.data.user.id}`,
          {
            user_metadata: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              role: formData.role,
            },
          },
          config
        );

        if (editUserRes.status === 201) {
          toast.success("User created successfully", {
            style: { backgroundColor: "green", color: "white" },
          });
        }

        if (setUserMetadataRes.data.error) {
          toast.error(editUserRes.data.error, {
            style: { backgroundColor: "red", color: "white" },
          });
        }
      } else {
        toast.error(editUserRes.data.error.code, {
          style: { backgroundColor: "red", color: "white" },
        });
      }
    } catch (error) {
      toast.error("Email is already in use", {
        style: { backgroundColor: "red", color: "white" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {};

  return (
    <div className="min-h-screen bg-background">
      <Toaster duration={5000} position="top-right" />
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Button variant={"outline"} onClick={handleResetPassword}>
                    Send Password Reset Email
                  </Button>
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
                  <Button type="submit">
                    {loading ? (
                      <>
                        <div className="animate-pulse animation-duration-1000">Submitting...</div>
                      </>
                    ) : (
                      <>Save Changes</>
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
