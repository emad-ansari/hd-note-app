import { Router, Request, Response } from "express";
import { authMiddleware, } from "../middleware/auth";
import { User } from "../models/User";

const router = Router();

// Example protected route
router.get("/profile", authMiddleware, async (req: Request, res: Response) => {
	const { userId } = req;
	console.log('userId: ', userId);

    const user = await User.findById(userId).select('username email');;
	console.log('this is user: ', user)

	res.json({
		message: "Welcome to your profile",
		user: user,
	});
});

export default router;
