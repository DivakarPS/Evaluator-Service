import { ZodSchema } from "zod"
import { NextFunction, Request, Response } from "express";
export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            error: error,
            message: "Invalid request body",
            data: {}
        });
    }
}