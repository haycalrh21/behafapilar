// validationMiddlewares.ts atau file middleware Anda
import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} ${issue.message}`,
        }));
        res.status(400).json({ error: errorMessage });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };
}
