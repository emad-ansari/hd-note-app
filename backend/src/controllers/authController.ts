import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { emailService } from "../utils/emailService";
import { z } from "zod";

// Validation schemas
const signupSchema = z.object({
	username: z.string().min(2).max(50),
	email: z.string().email(),
	dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
		message: "Invalid date format",
	}),
});

const otpVerificationSchema = z.object({
	email: z.string().email(),
	otp: z.string().length(6),
});

const loginSchema = z.object({
	email: z.string().email(),
});

// Helper function to generate OTP
const generateOTP = (): string => {
	return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// singup
export const signup = async (req: Request, res: Response) => {
	try {
		// Validate input
		const validationResult = signupSchema.safeParse(req.body);
		if (!validationResult.success) {
			return res.status(400).json({ 
				message: "Validation failed", 
				errors: validationResult.error
			});
		}

		const { username, email, dateOfBirth } = validationResult.data;

		// Check if user already exists
		let user = await User.findOne({ email });


		if (!user) {
			user = new User({ 
				username, 
				email, 
				dateOfBirth: new Date(dateOfBirth),
			});
		}

		// Generate OTP & expiry
		const otp = generateOTP();
		const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // valid 5 minutes

		user.otp = otp;
		user.otpExpires = otpExpires;
		await user.save();

		// Send OTP via email
		const emailSent = await emailService.sendOTP(email, otp, username);
		
		if (!emailSent) {
			// If email fails, still return success but log the issue
			console.warn(`Failed to send email to ${email}, but OTP was generated`);
		}

		return res.status(200).json({
			message: "OTP sent to your email successfully",
			email: email,
			...(process.env.NODE_ENV === 'development' && { otp }) // Only show OTP in development
		});
	} catch (error: any) {
		console.error("SIGNUP_ERROR:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

//
export const verifyOtp = async (req: Request, res: Response) => {
	try {
		// Validate input
		const validationResult = otpVerificationSchema.safeParse(req.body);
		if (!validationResult.success) {
			return res.status(400).json({ 
				message: "Validation failed", 
				errors: validationResult.error 
			});
		}

		const { email, otp } = validationResult.data;

		// Find user
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check OTP & expiry
		if (user.otp !== otp) {
			return res.status(400).json({ message: "Invalid OTP" });
		}

		if (!user.otpExpires || user.otpExpires < new Date()) {
			return res.status(400).json({ message: "OTP expired" });
		}

		// Clear OTP and mark email as verified
		user.otp = undefined;
		user.otpExpires = undefined;
		user.lastLogin = new Date();
		await user.save();

		// Send welcome email
		emailService.sendWelcomeEmail(email, user.username).catch(console.error);

		// Generate JWT token for session
		const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";
		const token = jwt.sign(
			{ userId: user._id, email: user.email },
			JWT_SECRET,
			{ expiresIn: "7d" } // Extended to 7 days for better UX
		);

		return res.status(200).json({
			message: "Email verified successfully! Welcome aboard!",
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
			},
		});
	} catch (error: any) {
		console.error("VERIFY_OTP_ERROR:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};


export const login = async (req: Request, res: Response) => {
	try {
		// Validate input
		const validationResult = loginSchema.safeParse(req.body);
		if (!validationResult.success) {
			return res.status(400).json({ 
				message: "Validation failed", 
				errors: validationResult.error 
			});
		}

		const { email } = validationResult.data;

		// Find user
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found. Please sign up first." });
		}

		// Generate OTP for login
		const otp = generateOTP();
		const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

		user.otp = otp;
		user.otpExpires = otpExpires;
		await user.save();

		// Send OTP via email
		const emailSent = await emailService.sendOTP(email, otp, user.username);
		
		if (!emailSent) {
			console.warn(`Failed to send login OTP to ${email}`);
		}

		return res.status(200).json({
			message: "Login OTP sent to your email",
			email: email,
			...(process.env.NODE_ENV === 'development' && { otp })
		});
	} catch (error: any) {
		console.error("LOGIN_ERROR:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// verify otp
export const verifyLoginOtp = async (req: Request, res: Response) => {
	try {
		// Validate input
		const validationResult = otpVerificationSchema.safeParse(req.body);
		if (!validationResult.success) {
			return res.status(400).json({ 
				message: "Validation failed", 
				errors: validationResult.error 
			});
		}

		const { email, otp } = validationResult.data;

		// Find user
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}


		// Check OTP & expiry
		if (user.otp !== otp) {
			return res.status(400).json({ message: "Invalid OTP" });
		}

		if (!user.otpExpires || user.otpExpires < new Date()) {
			return res.status(400).json({ message: "OTP expired" });
		}

		// Clear OTP and update last login
		user.otp = undefined;
		user.otpExpires = undefined;
		user.lastLogin = new Date();
		await user.save();

		// Generate JWT token for session
		const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";
		const token = jwt.sign(
			{ userId: user._id, email: user.email },
			JWT_SECRET,
			{ expiresIn: "7d" }
		);

		return res.status(200).json({
			message: "Login successful!",
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
			},
		});
	} catch (error: any) {
		console.error("VERIFY_LOGIN_OTP_ERROR:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		// In a real app, you might want to blacklist the token
		// For now, we'll just return success
		return res.status(200).json({ message: "Logged out successfully" });
	} catch (error: any) {
		console.error("LOGOUT_ERROR:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
