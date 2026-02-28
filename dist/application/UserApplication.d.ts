import { User } from "../domain/User";
import { UserPort } from "../domain/UserPort";
export declare class UserApplication {
    private port;
    constructor(port: UserPort);
    createUser(user: Omit<User, "id">): Promise<number>;
    getUserById(id: number): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    updateUser(id: number, user: Partial<User>): Promise<boolean>;
    deleteUser(id: number): Promise<boolean>;
}
//# sourceMappingURL=UserApplication.d.ts.map