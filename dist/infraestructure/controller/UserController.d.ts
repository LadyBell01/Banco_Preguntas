import { UserApplication } from "../../application/UserApplication";
import { Request, Response } from "express";
export declare class UserController {
    private app;
    constructor(application: UserApplication);
    createUser(req: Request, res: Response): Promise<Response>;
    updateUser(req: Request, res: Response): Promise<Response>;
    getAllUsers(req: Request, res: Response): Promise<Response>;
    getUserByEmail(req: Request, res: Response): Promise<Response>;
    deleteUser(req: Request, res: Response): Promise<Response>;
}
//# sourceMappingURL=UserController.d.ts.map