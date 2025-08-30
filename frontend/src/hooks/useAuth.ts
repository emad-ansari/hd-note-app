import { useState, useCallback } from "react";
import { apiService } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useAuth = () => {
	const navigate = useNavigate();
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
		let hasError = false;

		// Clear previous errors
		setErrorMessage({
			username: "",
			email: "",
			date: "",
			otp: "",
		});

		// Validation
		if (!username) {
			setErrorMessage((prev) => ({
				...prev,
				username: "Username is required",
			}));
			hasError = true;
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
		}

		if (!dateOfBirth) {
			setErrorMessage((prev) => ({
				...prev,
				date: "Date of Birth is required",
			}));
			hasError = true;
		}

		if (hasError) {
			return;
		}

		setLoading(true);

		try {
			// Call backend API to request OTP
			const response = await apiService.signup({
				username,
				email,
				dateOfBirth: dateOfBirth!.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
			});

			if (response.success) {
				setOpenOtpPopup(true);
				console.log("OTP sent successfully:", response.message);
				toast.success("OTP sent successfully! Check your email.");
			} else {
				// Handle validation errors from backend
				if (response.errors && response.errors.length > 0) {
					response.errors.forEach((error: any) => {
						if (error.field === 'username') {
							setErrorMessage(prev => ({ ...prev, username: error.message }));
						} else if (error.field === 'email') {
							setErrorMessage(prev => ({ ...prev, email: error.message }));
						} else if (error.field === 'dateOfBirth') {
							setErrorMessage(prev => ({ ...prev, date: error.message }));
						}
					});
				} else {
					setErrorMessage(prev => ({ ...prev, email: response.message || 'Failed to send OTP' }));
				}
				toast.error(response.message || 'Failed to send OTP');
			}
		} catch (error: any) {
			console.error("GET_OTP_ERROR: ", error);
			setErrorMessage((prev) => ({
				...prev,
				email: "Failed to send OTP. Please try again.",
			}));
			toast.error("Failed to send OTP. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const verifyOtp = async () => {
		if (!otp || otp.length !== 6) {
			setErrorMessage((prev) => ({
				...prev,
				otp: "Please enter a valid 6-digit OTP",
			}));
			toast.error("Please enter a valid 6-digit OTP");
			return;
		}

		setLoading(true);

		try {
			const response = await apiService.verifyOtp(email, otp);

			if (response.success) {
				// Store the token
				if (response.data?.token) {
					localStorage.setItem('authToken', response.data.token);
					localStorage.setItem('user', JSON.stringify(response.data.user));
				}
				
				toast.success("Email verified successfully! Welcome aboard!");
				// Redirect to dashboard
				navigate('/dashboard');
			} else {
				setErrorMessage((prev) => ({
					...prev,
					otp: response.message || 'OTP verification failed',
				}));
				toast.error(response.message || 'OTP verification failed');
			}
		} catch (error: any) {
			console.error("VERIFY_OTP_ERROR: ", error);
			setErrorMessage((prev) => ({
				...prev,
				otp: "Failed to verify OTP. Please try again.",
			}));
			toast.error("Failed to verify OTP. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const login = async (loginEmail: string) => {
		if (!loginEmail || !validateEmail(loginEmail)) {
			toast.error('Please enter a valid email');
			return { success: false, message: 'Please enter a valid email' };
		}
		setLoading(true);
		try {
			const response = await apiService.login(loginEmail);
			return response;
		} catch (error: any) {
			console.error("LOGIN_ERROR: ", error);
			toast.error('Login failed. Please try again.');
			return { success: false, message: 'Login failed. Please try again.' };
		}
		finally {
			setLoading(false)
		}
	};

	const verifyLoginOtp = async (loginEmail: string, loginOtp: string) => {
		if (!loginOtp || loginOtp.length !== 6) {
			toast.error('Please enter a valid 6-digit OTP');
			return { success: false, message: 'Please enter a valid 6-digit OTP' };
		}

		try {
			const response = await apiService.verifyLoginOtp(loginEmail, loginOtp);

			if (response.success && response.data?.token) {
				localStorage.setItem('authToken', response.data.token);
				localStorage.setItem('user', JSON.stringify(response.data.user));
				toast.success('Login successful! Welcome back!');
			}

			return response;
		} catch (error: any) {
			console.error("VERIFY_LOGIN_OTP_ERROR: ", error);
			toast.error('OTP verification failed. Please try again.');
			return { success: false, message: 'OTP verification failed. Please try again.' };
		}
		finally {
			setLoading(false);
		}
	};

	const logout = useCallback(async () => {
		setLoading(true);
		try {
			const response = await apiService.logout();
			if (response.success) {
				// Clear local storage
				localStorage.removeItem('authToken');
				localStorage.removeItem('userEmail');
				localStorage.removeItem('user');
				
				toast.success('Logged out successfully!');
				// Redirect to signin page
				navigate('/login');
			} else {
				console.error('Logout failed:', response.message);
				// Even if logout fails on backend, clear local storage
				localStorage.removeItem('authToken');
				localStorage.removeItem('userEmail');
				localStorage.removeItem('user');
				toast.success('Logged out successfully!');
				navigate('/login');
			}
		} catch (error) {
			console.error('Logout error:', error);
			// Clear local storage on error
			localStorage.removeItem('authToken');
			localStorage.removeItem('userEmail');
			localStorage.removeItem('user');
			toast.success('Logged out successfully!');
			navigate('/login');
		} finally {
			setLoading(false);
		}
	}, [navigate]);

	const isAuthenticated = () => {
		return !!localStorage.getItem('authToken');
	};

	const getCurrentUser = () => {
		const userStr = localStorage.getItem('user');
		return userStr ? JSON.parse(userStr) : null;
	};

	return {
		username,
		email,
		otp,
		getOtp,
		verifyOtp,
		login,
		verifyLoginOtp,
		logout,
		errorMessage,
		setUsername,
		setEmail,
		setOtp,
		openOtpPopup,
		setOpenOtpPopup,
		loading,
		setErrorMessage,
		dateOfBirth,
		setDateOfBirth,
		isAuthenticated,
		getCurrentUser,
	};
};
