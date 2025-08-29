import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

// Helper function to generate OTP
const generateOTP = (): string => {
	return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// 📌 Signup (Request OTP)
export const signup = async (req: Request, res: Response) => {
	try {
		console.log("request come");
		const { username, email, dateOfBirth } = req.body;

		if (!username || !email || !dateOfBirth) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if user already exists
		let user = await User.findOne({ email });

		if (!user) {
			user = new User({ username, email, dateOfBirth });
		}

		// Generate OTP & expiry
		const otp = generateOTP();
		const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // valid 5 minutes

		user.otp = otp;
		user.otpExpires = otpExpires;
		await user.save();

		// ⚡ For now: just send OTP in response (later we’ll send via email)
		return res.status(200).json({
			message: "OTP generated successfully",
			otp,
		});
	} catch (error: any) {
		console.error("SIGNUP_ERROR:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const verifyOtp = async (req: Request, res: Response) => {
	try {
		const { email, otp } = req.body;

		if (!email || !otp) {
			return res
				.status(400)
				.json({ message: "Email and OTP are required" });
		}

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

		user.otp = undefined;
		user.otpExpires = undefined;
		await user.save();

		// Generate JWT token for session
		const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";
    console.log('this is jwt-secret: ', JWT_SECRET);
		const token = jwt.sign(
			{ userId: user._id, email: user.email },
			JWT_SECRET,
			{ expiresIn: "1h" }
		);

		return res.status(200).json({
			message: "OTP verified successfully",
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				dateOfBirth: user.dateOfBirth,
			},
		});
	} catch (error: any) {
		console.error("VERIFY_OTP_ERROR:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
