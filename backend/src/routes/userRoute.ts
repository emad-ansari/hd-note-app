import { Router, Request, Response } from "express";
import { authMiddleware, } from "../middleware/auth";
import { User } from "../models/User";

const router = Router();


router.get("/profile", authMiddleware, async (req: Request, res: Response) => {
	const { userId } = req;
	console.log('userId: ', userId);

    const user = await User.findById(userId).select('username email createdAt');
	console.log('this is user: ', user)

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	res.json({
		message: "Welcome to your profile",
		user: user,
	});
});

export default router;
