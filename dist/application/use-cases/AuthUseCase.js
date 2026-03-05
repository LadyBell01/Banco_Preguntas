import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "ashjf83uoiaedu834ujah833hhysh24";
export class AuthUseCase {
    static generateToken(payload) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    }
    static verifyToken(token) {
        return jwt.verify(token, JWT_SECRET);
    }
}
