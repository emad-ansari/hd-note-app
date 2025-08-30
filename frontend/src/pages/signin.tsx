import { useState } from "react";
import { Button } from "@/components/ui/button";
import icon from "@/assets/icon.png";
import container from "@/assets/container.png";
import { toast } from "react-toastify";

import { Checkbox } from "@/components/ui/checkbox";
import { OTPInput } from "@/components/ui/otp-input";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { InputWithLabel } from "@/components/common/custom-input";
import { useAuth } from "@/hooks/useAuth";

export default function SignInPage() {
	const navigate = useNavigate();
	const {
		login,
		verifyLoginOtp,
		loading,
	} = useAuth();

	const [formData, setFormData] = useState({
		email: "",
		otp: "",
	});
	const [showOtpInput, setShowOtpInput] = useState(false);
	const [loginError, setLoginError] = useState("");

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear errors when user types
		if (field === 'email') {
			setLoginError("");
		}
	};

	const handleGetOtp = async () => {
		if (!formData.email) {
			setLoginError("Please enter your email");
			toast.error("Please enter your email");
			return;
		}

		try {
			const response = await login(formData.email);
			if (response.success) {
				setShowOtpInput(true);
				setLoginError("");
				toast.success("Login OTP sent! Check your email.");
			} else {
				// Show more specific error messages
				let errorMessage = response.message || "Failed to send OTP";
				
				// Provide helpful guidance based on error
				if (response.message?.includes("not found")) {
					errorMessage = "No account found with this email. Please sign up first.";
				} else if (response.message?.includes("verify your email")) {
					errorMessage = "Please complete your signup by verifying your email first.";
				}
				
				setLoginError(errorMessage);
				toast.error(errorMessage);
			}
		} catch (error) {
			setLoginError("Failed to send OTP. Please try again.");
			toast.error("Failed to send OTP. Please try again.");
		}
	};

	const handleSignIn = async () => {
		if (!formData.otp || formData.otp.length !== 6) {
			setLoginError("Please enter a valid 6-digit OTP");
			toast.error("Please enter a valid 6-digit OTP");
			return;
		}

		try {
			const response = await verifyLoginOtp(formData.email, formData.otp);
			if (response.success) {
				toast.success("Login successful! Welcome back!");
				// Redirect to dashboard on success
				navigate('/dashboard');
			} else {
				setLoginError(response.message || "OTP verification failed");
				toast.error(response.message || "OTP verification failed");
			}
		} catch (error) {
			setLoginError("Failed to verify OTP. Please try again.");
			toast.error("Failed to verify OTP. Please try again.");
		}
	};

	return (
		<div className="h-screen bg-white">
			<div className="flex flex-row min-h-screen md:h-screen">
				<div className="flex w-full md:w-[591px] flex-col  px-1 py-8  md:p-8">

					<div className="flex items-center justify-center md:justify-start gap-2 ">
						<img src={icon} alt="website-logo" />
						<span className="text-xl font-semibold text-typography">
							HD
						</span>
					</div>
					<div className="flex-1  md:px-16 py-10 ">
						<div className="max-w-sm mx-auto md:mx-0">
							<div className="flex flex-col  items-center md:items-start md:pt-16">
								<h1 className="text-2xl md:text-3xl font-bold text-typography mb-2">
									Sign In
								</h1>
								<p className="text-[#969696] mb-8">
									Please login to continue to your account.
								</p>
							</div>

							<div className="space-y-6">

								<InputWithLabel
									label="Email"
									value={formData.email}
									placeholder="jonas_kahnwald@gmail.com"
									errorMessage={loginError}
									onChange={(e) => handleInputChange("email", e.target.value)}
								/>

								{!showOtpInput && (
									<Button
										className="w-full bg-[#367AFF] hover:bg-blue-600 text-white py-6 rounded-lg font-medium text-base"
										onClick={handleGetOtp}
										disabled={loading}
									>
										{loading ? "Sending OTP..." : "Get OTP"}
									</Button>
								)}

								
								{showOtpInput && (
									<OTPInput 
										label="OTP" 
										value={formData.otp}
										onChange={(e) => handleInputChange("otp", e.target.value)}
										errorMessage={loginError}
									/>
								)}

								<div className="flex flex-col gap-3">
									{showOtpInput && (
										<Button
											onClick={handleGetOtp}
											className="text-blue-500 text-sm font-medium hover:underline bg-transparent p-0 h-auto"
											disabled={loading}
										>
											Resend OTP
										</Button>
									)}
                                    <div className="flex gap-2 ">
    									<Checkbox className="w-5 h-5 text-[#232323]"/>
                                        <Label >Keep me logged in</Label>
                                    </div>
								</div>

								<div className="flex flex-col gap-7">
									{showOtpInput && (
										<Button
											className="w-full bg-[#367AFF] hover:bg-blue-600 text-white py-6 rounded-lg font-medium text-base"
											onClick={handleSignIn}
											disabled={loading}
										>
											{loading ? "Signing In..." : "Sign In"}
										</Button>
									)}
									<div className="flex gap-1 justify-center text-center">
										<span className="text-gray-500 text-sm">
											Need an account?
										</span>
										<Link
											to="/"
											className="text-blue-500 text-sm font-medium hover:underline"
										>
											Create One
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="hidden md:flex p-3 md:w-[849px]">
					<img
						src={container}
						alt="container-image"
						className="w-full bg-contain"
					/>
				</div>
			</div>
		</div>
	);
}
