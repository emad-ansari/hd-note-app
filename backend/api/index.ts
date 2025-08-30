import app from "../index";
import { Request, Response } from "express";

// Vercel expects default export function
export default (req: Request, res: Response) => {
  return app(req, res);
};