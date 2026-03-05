export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
export class BadRequestError extends AppError {
    constructor(message = "Solicitud inválida") {
        super(message, 400);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = "No autorizado") {
        super(message, 401);
    }
}
export class ForbiddenError extends AppError {
    constructor(message = "Acceso denegado") {
        super(message, 403);
    }
}
export class NotFoundError extends AppError {
    constructor(message = "Recurso no encontrado") {
        super(message, 404);
    }
}
export class ConflictError extends AppError {
    constructor(message = "Conflicto con el recurso") {
        super(message, 409);
    }
}
export class ValidationError extends AppError {
    details;
    constructor(message = "Error de validación", details = []) {
        super(message, 400);
        this.details = details;
    }
}
export function errorHandler(err, req, res, next) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);
    if (err instanceof ValidationError) {
        const response = {
            error: err.message,
            details: err.details.length > 0 ? err.details : undefined,
        };
        res.status(err.statusCode).json(response);
        return;
    }
    if (err instanceof AppError) {
        const response = {
            error: err.message,
        };
        if (process.env.NODE_ENV === "development") {
            response.stack = err.stack;
        }
        res.status(err.statusCode).json(response);
        return;
    }
    const response = {
        error: "Error interno del servidor",
    };
    if (process.env.NODE_ENV === "development") {
        response.details = err.message;
        response.stack = err.stack;
    }
    res.status(500).json(response);
}
export function notFoundHandler(req, res) {
    res.status(404).json({
        error: "Endpoint no encontrado",
        details: `La ruta ${req.method} ${req.originalUrl} no existe`,
    });
}
export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
