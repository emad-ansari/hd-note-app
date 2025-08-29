import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db";
import authRoute from "./src/routes/authRoute";
import userRoutes from "./src/routes/userRoute";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

// app.use("/auth", authRoutes);
// Routes
app.get("/", (req, res) => {
	res.send("API is running...");
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoutes);

connectDB().then(() => {
	app.listen(PORT, () =>
		console.log(`🚀 Server running on http://localhost:${PORT}`)
	);
});
