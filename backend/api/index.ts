import app from "../index";
import { VercelRequest, VercelResponse } from "@vercel/node";

// Vercel expects a default export function
export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res); // delegate to Express
};
