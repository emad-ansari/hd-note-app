import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
	createNote,
	getUserNotes,
	updateNote,
	deleteNote,
} from "../controllers/noteController";

const router = Router();

// All note routes require authentication
router.use(authMiddleware);

// Note CRUD operations
router.post("/", createNote);
router.get("/", getUserNotes);
router.put("/:noteId", updateNote);
router.delete("/:noteId", deleteNote);

export default router;
