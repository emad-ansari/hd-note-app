import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateRequest = (schema: z.ZodSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const validatedData = schema.parse({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			
			req.body = validatedData.body;
			req.query = validatedData.query;
			req.params = validatedData.params;
			
			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				return res.status(400).json({
					message: "Validation failed",
					errors: error.errors.map(err => ({
						field: err.path.join('.'),
						message: err.message,
					})),
				});
			}
			next(error);
		}
	};
};

// Common validation schemas
export const paginationSchema = z.object({
	query: z.object({
		page: z.string().optional().transform(val => parseInt(val || '1')),
		limit: z.string().optional().transform(val => parseInt(val || '10')),
	}),
});

export const idParamSchema = z.object({
	params: z.object({
		id: z.string().min(1, "ID is required"),
	}),
});

export const noteIdParamSchema = z.object({
	params: z.object({
		noteId: z.string().min(1, "Note ID is required"),
	}),
});
