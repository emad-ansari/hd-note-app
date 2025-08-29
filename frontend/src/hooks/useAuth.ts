import { useState } from "react";

export const useAuth = () => {
	const [openOtpPopup, setOpenOtpPopup] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [otp, setOtp] = useState<string>("");
	const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);

	const [errorMessage, setErrorMessage] = useState<{
		username: string;
		email: string;
		date: string;
		otp: string;
	}>({
		username: "",
		email: "",
		date: "",
		otp: "",
	});

	const validateEmail = (value: string) => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(value);
	};

	const getOtp = async () => {
		let hasError = false; // Flag to track if any error occurred

		if (!username) {
			setErrorMessage((prev) => ({
				...prev,
				username: "Username is required",
			}));
			hasError = true;
		} else {
			setErrorMessage((prev) => ({ ...prev, username: "" }));
		}

		if (!email) {
			setErrorMessage((prev) => ({
				...prev,
				email: "Email is required field",
			}));
			hasError = true;
		} else if (!validateEmail(email)) {
			setErrorMessage((prev) => ({
				...prev,
				email: "Invalid email address",
			}));
			hasError = true;
		} else {
			setErrorMessage((prev) => ({ ...prev, email: "" }));
		}

		if (!dateOfBirth) {
			setErrorMessage((prev) => ({
				...prev,
				date: "Date of Birth is required",
			}));
			hasError = true;
		} else {
			setErrorMessage((prev) => ({ ...prev, date: "" }));
		}

		if (!otp || isNaN(Number(otp))) {
			setErrorMessage((prev) => ({
				...prev,
				otp: "OTP must be a valid number",
			}));
			hasError = true;
		} else {
			setErrorMessage((prev) => ({
				...prev,
				otp: "",
			}));
		}

		if (hasError) {
			return;
		}

		setOpenOtpPopup(true);
		setLoading(true);

		try {
			// Here you would typically make an API call to get the OTP
			// You can now access username, email, and dateOfBirth here.
			console.log("Sending OTP for:", { username, email, dateOfBirth });

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Assuming OTP is received, you might set it here
			// setOtp(123456);
		} catch (error: any) {
			console.error("GET_OTP_ERROR: ", error.message);
			setErrorMessage((prev) => ({
				...prev,
				otp: "Failed to send OTP. Please try again.",
			}));
		} finally {
			setLoading(false);
		}
	};

	return {
		username,
		email,
		otp,
		getOtp,
		errorMessage,
		setUsername,
		setEmail,
		setOtp,
		openOtpPopup,
		setOpenOtpPopup,
		loading,
		setErrorMessage,
		dateOfBirth,
		setDateOfBirth, // Make setDateOfBirth available
	};
};
