import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useNavigate } from "react-router";
import { passwordMinLength, passwordPattern, passwordTitle } from "@/global";

export default function ResetPassword() {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const navigate = useNavigate();

	const handleResetPassword = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle password reset logic here
		window.alert("Password reset successful!");
		navigate("/login", { replace: true });
	};

	return (
		<div className="min-h-screen bg-background">
			<Toaster duration={5000} position="top-right" />

			{/* Main Content */}
			<div className="p-6 lg:p-8">
				<div className="flex flex-col space-y-6 max-w-2xl mx-auto">
					{/* Header */}
					<div className="flex flex-col space-y-4">
						<div>
							<h1 className="text-2xl font-bold">Reset Your Password</h1>
							<p className="text-muted-foreground">
								Create a new secure password for your account
							</p>
						</div>
					</div>

					{/* Password Reset Card */}
					<Card>
						<CardHeader>
							<div className="flex items-center space-x-2">
								<KeyRound className="h-5 w-5" />
								<CardTitle>Create New Password</CardTitle>
							</div>
							<CardDescription>
								Enter your new password below to secure your account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								className="space-y-6"
								onSubmit={(e) => handleResetPassword(e)}
							>
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
												onClick={() => setShowNewPassword(!showNewPassword)}
											>
												{showNewPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
												<span className="sr-only">
													{showNewPassword ? "Hide password" : "Show password"}
												</span>
											</Button>
										</div>
										<p className="text-xs text-muted-foreground">
											Password must be at least 8 characters long
										</p>
									</div>

									<div className="space-y-2">
										<Label htmlFor="confirm-password">
											Confirm New Password
										</Label>
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
												onClick={() =>
													setShowConfirmPassword(!showConfirmPassword)
												}
											>
												{showConfirmPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
												<span className="sr-only">
													{showConfirmPassword
														? "Hide password"
														: "Show password"}
												</span>
											</Button>
										</div>
									</div>
								</div>

								<div className="flex items-center space-x-2 pt-4">
									<Button
										type="submit"
										className="flex-1 sm:flex-none cursor-pointer"
										disabled={
											newPassword !== confirmPassword ||
											newPassword === "" ||
											confirmPassword === "" ||
											newPassword.includes(" ") ||
											confirmPassword.includes(" ")
										}
									>
										Reset Password
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>

					{/* Security Notice */}
					<div className="p-4 bg-muted rounded-lg">
						<p className="text-sm text-muted-foreground">
							<strong>Security tip:</strong> Use a strong password that includes
							a mix of letters, numbers, and special characters. Avoid using
							personal information or common words.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
