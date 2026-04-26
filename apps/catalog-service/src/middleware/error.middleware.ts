import { NextFunction, Request, Response } from "express";
import { ConflictError } from "../domain/errors/domain.error";
import { ZodError } from "zod";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Erro de validação",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({
      message: err.message,
    });
  }

  if (err instanceof Error) {
    return res.status(400).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Erro interno do servidor",
  });
}
