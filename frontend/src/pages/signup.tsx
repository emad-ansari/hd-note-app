import { Button } from "@/components/ui/button";
import icon from "@/assets/icon.png";
import container from "@/assets/container.png";
import { toast } from "react-toastify";

import { useAuth } from "@/hooks/useAuth";
import { DatePickerInput } from "@/components/common/date-input";
import { OTPInput } from "@/components/ui/otp-input";
import { Link } from "react-router-dom";
import { InputWithLabel } from "@/components/common/custom-input";

export default function SignUpPage() {
	const {
		username,
		email,
		otp,
		getOtp,
		verifyOtp,
		errorMessage,
		setOtp,
		setEmail,
		setUsername,
		openOtpPopup,
		setErrorMessage,
		dateOfBirth,
		setDateOfBirth,
		loading,
	} = useAuth();

	// Enhanced getOtp with toast
	const handleGetOtp = async () => {
		try {
			await getOtp();
			// If we reach here, OTP was sent successfully
			toast.success("OTP sent successfully! Check your email.");
		} catch (error) {
			// Error handling is done in the hook, but we can show a toast here too
			toast.error("Failed to send OTP. Please try again.");
		}
	};

	// Enhanced verifyOtp with toast
	const handleVerifyOtp = async () => {
		try {
			await verifyOtp();
			// If we reach here, verification was successful
			toast.success("Email verified successfully! Welcome aboard!");
		} catch (error) {
			// Error handling is done in the hook, but we can show a toast here too
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
									Sign up
								</h1>
								<p className="text-[#969696] mb-8">
									Sign up to enjoy the feature of HD
								</p>
							</div>

							<div className="space-y-6">
								<InputWithLabel
									label="Your Name"
									placeholder="Jhon Doe"
									value={username}
									errorMessage={errorMessage.username}
									onChange={(e) => {
										setErrorMessage((prev) => ({
											...prev,
											username: "",
										}));
										setUsername(e.target.value);
									}}
								/>

								<DatePickerInput
									value={dateOfBirth}
									onChange={setDateOfBirth}
									errorMessage={errorMessage.date}
								/>

								<InputWithLabel
									label="Email"
									value={email}
									placeholder="jonas_kahnwald@gmail.com"
									errorMessage={errorMessage.email}
									onChange={(e) => {
										setErrorMessage((prev) => ({
											...prev,
											email: "",
										}));
										setEmail(e.target.value);
									}}
								/>

								{!openOtpPopup && (
									<Button
										className="w-full bg-[#367AFF] hover:bg-blue-600 text-white py-6 rounded-lg font-medium text-base"
										onClick={handleGetOtp}
										disabled={loading}
									>
										{loading ? "Sending OTP..." : "Get OTP"}
									</Button>
								)}
								
								{openOtpPopup && (
									<div className="space-y-6">
										<OTPInput
											label="OTP"
											value={otp}
											onChange={(e) => {
												setErrorMessage((prev) => ({
													...prev,
													otp: "",
												}));
												setOtp(e.target.value);
											}}
											errorMessage={errorMessage.otp}
										/>

										<Button
											className="w-full bg-[#367AFF] hover:bg-blue-600 text-white py-6 rounded-lg font-medium text-base"
											onClick={handleVerifyOtp}
											disabled={loading}
										>
											{loading ? "Verifying..." : "Sign up"}
										</Button>
									</div>
								)}
								
								<div className="text-center">
									<span className="text-gray-500 text-sm">
										Already have an account?{" "}
									</span>
									<Link
										to="/login"
										className="text-blue-500 text-sm font-medium hover:underline"
									>
										Sign in
									</Link>
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
