import { Router } from "express";
import { 
	signup, 
	verifyOtp, 
	login, 
	verifyLoginOtp,
	logout
} from "../controllers/authController";
import { otpRateLimit, authRateLimit } from "../middleware/rateLimit";

const router = Router();

// Email-based authentication with rate limiting
router.post("/signup", otpRateLimit, signup);
router.post("/verify-otp", otpRateLimit, verifyOtp);
router.post("/login", otpRateLimit, login);
router.post("/verify-login-otp", otpRateLimit, verifyLoginOtp);
router.post("/logout", authRateLimit, logout);

export default router;
