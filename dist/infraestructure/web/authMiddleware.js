import { AuthUseCase } from "../../application/use-cases/AuthUseCase.js";
export function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Token no proporcionado" });
        return;
    }
    try {
        const payload = AuthUseCase.verifyToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(403).json({ error: "Token inválido o expirado" });
        return;
    }
}
