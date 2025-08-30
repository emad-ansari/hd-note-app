import { Request, Response } from "express";
import { Note } from "../models/Note";
import { z } from "zod";

// Validation schemas
const createNoteSchema = z.object({
	title: z.string().min(1).max(100),
	content: z.string().min(1).max(10000),
});

const updateNoteSchema = z.object({
	title: z.string().min(1).max(100).optional(),
	content: z.string().min(1).max(10000).optional(),
});

// create new note.
export const createNote = async (req: Request, res: Response) => {
	try {
		const { userId } = req;
		if (!userId) {
			return res.status(401).json({ message: "Authentication required" });
		}

		// Validate input
		const validationResult = createNoteSchema.safeParse(req.body);
		if (!validationResult.success) {
			return res.status(400).json({ 
				message: "Validation failed", 
				errors: validationResult.error.issues 
			});
		}

		const { title, content } = validationResult.data;

		// Create new note
		const note = new Note({
			title,
			content,
			userId,
		});

		await note.save();

		return res.status(201).json({
			message: "Note created successfully",
			note: {
				id: note._id,
				title: note.title,
				content: note.content,
				createdAt: note.createdAt,
				updatedAt: note.updatedAt,
			},
		});
	} catch (error: any) {
		console.error("CREATE_NOTE_ERROR:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// get all user notes
export const getUserNotes = async (req: Request, res: Response) => {
	try {
		const { userId } = req;
		if (!userId) {
			return res.status(401).json({ message: "Authentication required" });
		}

		const { page = 1, limit = 10, search } = req.query;
		const pageNum = parseInt(page as string) || 1;
		const limitNum = parseInt(limit as string) || 10;
		const skip = (pageNum - 1) * limitNum;

		// Build query
		let query: any = { userId };
		
		if (search) {
			query.$text = { $search: search as string };
		}

		// Get notes with pagination
		const notes = await Note.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limitNum)
			.select('-__v');

		// Get total count for pagination
		const total = await Note.countDocuments(query);

		return res.status(200).json({
			notes,
			pagination: {
				currentPage: pageNum,
				totalPages: Math.ceil(total / limitNum),
				totalNotes: total,
				hasNext: pageNum * limitNum < total,
				hasPrev: pageNum > 1,
			},
		});
	} catch (error: any) {
		console.error("GET_NOTES_ERROR:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// update note
export const updateNote = async (req: Request, res: Response) => {
	try {
		const { userId } = req;
		const { noteId } = req.params;

		if (!userId) {
			return res.status(401).json({ message: "Authentication required" });
		}

		// Validate input
		const validationResult = updateNoteSchema.safeParse(req.body);
		if (!validationResult.success) {
			return res.status(400).json({ 
				message: "Validation failed", 
				errors: validationResult.error.issues
			});
		}

		const updateData = validationResult.data;

		// Find and update note
		const note = await Note.findOneAndUpdate(
			{ _id: noteId, userId },
			{ ...updateData, updatedAt: new Date() },
			{ new: true, runValidators: true }
		).select('-__v');

		if (!note) {
			return res.status(404).json({ message: "Note not found" });
		}

		return res.status(200).json({
			message: "Note updated successfully",
			note: {
				id: note._id,
				title: note.title,
				content: note.content,
				createdAt: note.createdAt,
				updatedAt: note.updatedAt,
			},
		});
	} catch (error: any) {
		console.error("UPDATE_NOTE_ERROR:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// delete note
export const deleteNote = async (req: Request, res: Response) => {
	try {
		const { userId } = req;
		const { noteId } = req.params;

		if (!userId) {
			return res.status(401).json({ message: "Authentication required" });
		}

		const note = await Note.findOneAndDelete({ _id: noteId, userId });

		if (!note) {
			return res.status(404).json({ message: "Note not found" });
		}

		return res.status(200).json({
			message: "Note deleted successfully",
			deletedNote: {
				id: note._id,
				title: note.title,
			},
		});
	} catch (error: any) {
		console.error("DELETE_NOTE_ERROR:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
