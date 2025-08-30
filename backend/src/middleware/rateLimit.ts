import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
	[key: string]: {
		count: number;
		resetTime: number;
	};
}

const store: RateLimitStore = {};

export const rateLimit = (
	windowMs: number = 15 * 60 * 1000, // 15 minutes
	maxRequests: number = 100 // max 100 requests per window
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const key = req.ip || 'unknown';
		const now = Date.now();

		// Clean up expired entries
		if (store[key] && store[key].resetTime < now) {
			delete store[key];
		}

		// Initialize or increment counter
		if (!store[key]) {
			store[key] = {
				count: 1,
				resetTime: now + windowMs,
			};
		} else {
			store[key].count++;
		}

		// Check if limit exceeded
		if (store[key].count > maxRequests) {
			return res.status(429).json({
				message: "Too many requests. Please try again later.",
				retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
			});
		}

		// Add rate limit headers
		res.set({
			'X-RateLimit-Limit': maxRequests,
			'X-RateLimit-Remaining': Math.max(0, maxRequests - store[key].count),
			'X-RateLimit-Reset': store[key].resetTime,
		});

		next();
	};
};

// Specific rate limit for auth endpoints (more restrictive)
export const authRateLimit = rateLimit(15 * 60 * 1000, 10); // 10 requests per 15 minutes

// Rate limit for OTP endpoints (very restrictive)
export const otpRateLimit = rateLimit(15 * 60 * 1000, 10); // 3 requests per 15 minutes
