import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Solicitud inválida") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "No autorizado") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Acceso denegado") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso no encontrado") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflicto con el recurso") {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  public readonly details: string[];

  constructor(message: string = "Error de validación", details: string[] = []) {
    super(message, 400);
    this.details = details;
  }
}

export interface ErrorResponse {
  error: string;
  details?: string | string[];
  stack?: string;
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);

  if (err instanceof ValidationError) {
    const response: ErrorResponse = {
      error: err.message,
      details: err.details.length > 0 ? err.details : undefined,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  if (err instanceof AppError) {
    const response: ErrorResponse = {
      error: err.message,
    };

    if (process.env.NODE_ENV === "development") {
      response.stack = err.stack;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  const response: ErrorResponse = {
    error: "Error interno del servidor",
  };

  if (process.env.NODE_ENV === "development") {
    response.details = err.message;
    response.stack = err.stack;
  }

  res.status(500).json(response);
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: "Endpoint no encontrado",
    details: `La ruta ${req.method} ${req.originalUrl} no existe`,
  });
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
