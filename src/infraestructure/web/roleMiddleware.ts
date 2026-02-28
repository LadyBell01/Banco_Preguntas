import { Request, Response, NextFunction } from "express";
import { UserRole } from "../../domain/entities/User.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: UserRole;
  };
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "No autenticado" });
      return;
    }

    if (!user.role) {
      res.status(403).json({ error: "Usuario sin rol asignado" });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        error: "Acceso denegado",
        details: `Se requiere uno de los siguientes roles: ${allowedRoles.join(", ")}`,
      });
      return;
    }

    next();
  };
}

export function requireExpertRole(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }

  if (user.role !== UserRole.DOCENTE_EXPERTO && user.role !== UserRole.ADMIN) {
    res.status(403).json({
      error: "Acceso denegado",
      details: "Solo los Docentes Expertos o Administradores pueden validar preguntas",
    });
    return;
  }

  next();
}
