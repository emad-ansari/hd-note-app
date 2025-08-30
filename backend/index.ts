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

// Middlewaren
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
const allowedOrigins = [
	"https://hd-note-app-gamma.vercel.app",
	"http://localhost:5173",
];

app.use(cors({ 
	origin: allowedOrigins,
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true 
}));
app.use(cookieParser());

// Health check route
app.get("/", (req, res) => {
	res.json({ 
		message: "HD Notes API is running...",
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


connectDB();
// Connect to database and start server
// connectDB().then(() => {
// 	app.listen(PORT, () => {
// 		console.log(`🚀 Server running on http://localhost:${PORT}`);
// 		console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
// 		console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Using default'}`);
// 		console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
// 	});
// }).catch((error) => {
// 	console.error("❌ Failed to start server:", error);
// 	process.exit(1);
// });


export default app;