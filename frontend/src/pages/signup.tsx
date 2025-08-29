import { Button } from "@/components/ui/button";
import icon from "@/assets/icon.png";
import container from "@/assets/container.png";

import { useAuth } from "@/hooks/useAuth";
import { DatePickerInput } from "@/components/common/date-input";
import { OTPInput } from "@/components/ui/otp-input";
import { Link } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import { InputWithLabel } from "@/components/common/custom-input";

export default function SignUpPage() {
	const {
		username,
		email,
		otp,
		getOtp,
		errorMessage,
		setOtp,
		setEmail,
		setUsername,
		openOtpPopup,
		setOpenOtpPopup,
		setErrorMessage,
		dateOfBirth,
		setDateOfBirth,
	} = useAuth();

	return (
		<div className="h-screen bg-white">
			<div className="flex flex-row min-h-screen md:h-screen">
				<div className="flex w-full md:w-[591px] flex-col  px-1 py-8  md:p-8">
					{/* Header with HD logo */}
					<div className="flex items-center justify-center md:justify-start gap-2 ">
						<img src={icon} alt="website-logo" />
						<span className="text-xl font-semibold text-typography">
							HD
						</span>
					</div>

					{/* Form Content */}
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

								{/* Get OTP Button */}
								{!openOtpPopup && (
									<Button
										className="w-full bg-[#367AFF] hover:bg-blue-600 text-white py-6 rounded-lg font-medium text-base"
										onClick={() => getOtp()}
									>
										Get OTP
									</Button>
								)}
								{openOtpPopup && (
									<div className="space-y-6">
										<div>
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
											/>
											{errorMessage.otp && (
												<div className="flex flex-row gap-2 items-center text-red-500  px-2 mt-2">
													<CircleAlert className="w-3 h-3" />
													<label
														htmlFor="error-message"
														className="text-red-500 text-sm"
													>
														{errorMessage.otp}
													</label>
												</div>
											)}
										</div>
										<Button
											className="w-full bg-[#367AFF] hover:bg-blue-600 text-white py-6 rounded-lg font-medium text-base"
											onClick={() =>
												setOpenOtpPopup((prev) => !prev)
											}
										>
											Sign up
										</Button>
									</div>
								)}

								{/* Sign in link */}
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

			{/* Mobile home indicator */}
		</div>
	);
}
