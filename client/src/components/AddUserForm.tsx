import { useState } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import axios from "axios";
import supabase from "@/util/supabase";
import { passwordMinLength, passwordPattern, passwordTitle } from "@/global";

export default function AddUserForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

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
      email_confirm: true,
      password: formData.password,
      user_metadata: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
      },
    };

    // Create the user
    try {
      const createUserRes = await axios.post("https://gxjoufckpcmbdieviauq.supabase.co/functions/v1/user", formInput, config);
      // Inert into admin table if role is admin
      if (formData.role.toLowerCase() === "admin") {
        const insertRes = await supabase.from("administrators").insert({
          user_id: createUserRes.data.user.id,
          created_at: createUserRes.data.user.created_at,
        });
        console.log(insertRes);
      }

      // Set user metadata
      if (createUserRes.status === 201 && createUserRes.data.user) {
        const setUserMetadataRes = await axios.put(
          `https://gxjoufckpcmbdieviauq.supabase.co/functions/v1/user/${createUserRes.data.user.id}`,
          {
            user_metadata: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              role: formData.role,
            },
          },
          config
        );

        if (createUserRes.status === 201) {
          toast.success("User created successfully", {
            style: { backgroundColor: "green", color: "white" },
          });
        }

        if (setUserMetadataRes.data.error) {
          toast.error(createUserRes.data.error, {
            style: { backgroundColor: "red", color: "white" },
          });
        }

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "",
        });
      } else {
        toast.error(createUserRes.data.error.code, {
          style: { backgroundColor: "red", color: "white" },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Email is already in use ", {
        style: { backgroundColor: "red", color: "white" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/users");
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster duration={5000} position="top-right" />
      <div className="p-6 lg:p-8">
        <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Users
                </Button>
              </div>
              <h1 className="text-2xl font-bold">Add New User</h1>
              <p className="text-muted-foreground">Create a new user account for the system</p>
            </div>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5" />
                <CardTitle>User Information</CardTitle>
              </div>
              <CardDescription>Fill in the details below to create a new user account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" type="text" placeholder="Enter first name" value={formData.firstName} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" type="text" placeholder="Enter last name" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Enter email address" value={formData.email} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={passwordMinLength}
                    pattern={passwordPattern}
                    title={passwordTitle}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={handleRoleChange} required>
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
                  <Button type="button" variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button type="submit">
                    {loading ? (
                      <>
                        <div className="animate-pulse animation-duration-1000">Submitting...</div>
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Submit
                      </>
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
