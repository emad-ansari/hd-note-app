import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db";
import authRoute from "./src/routes/authRoute";
import userRoutes from "./src/routes/userRoute";
import noteRoutes from "./src/routes/noteRoute";

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({ 
	origin: process.env.FRONTEND_URL || "http://localhost:5173", 
	credentials: true 
}));
app.use(cookieParser());

// Health check route
app.get("/", (req, res) => {
	res.json({ 
		message: "🚀 HD Assignment API is running...",
		version: "1.0.0",
		timestamp: new Date().toISOString()
	});
});

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoutes);
app.use("/api/notes", noteRoutes);

// 404 handler
app.use("*", (req, res) => {
	res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.error("Global error:", error);
	res.status(500).json({ 
		message: "Internal server error",
		error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
	});
});

// Connect to database and start server
connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`🚀 Server running on http://localhost:${PORT}`);
		console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
		console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Using default'}`);
		console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
	});
}).catch((error) => {
	console.error("❌ Failed to start server:", error);
	process.exit(1);
});
