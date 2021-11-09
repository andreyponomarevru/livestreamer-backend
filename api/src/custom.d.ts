// We need to import something otherwise TypeScript throws an error
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      // Now in your code your can access it like 'req.tenant'
      tenant?: string;
    }
  }
}
