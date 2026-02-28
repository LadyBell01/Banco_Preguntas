import { User as UserDomain } from " ../../domain/User";
import { UserPort } from "../../domain/UserPort";
export declare class UserAdapter implements UserPort {
    private userRepository;
    constructor();
    private toDomain;
    private toEntity;
    createUser(user: Omit<UserDomain, "id">): Promise<number>;
    updateUser(id: number, user: Partial<UserDomain>): Promise<boolean>;
    deleteUser(id: number): Promise<boolean>;
    getUserById(id: number): Promise<UserDomain | null>;
    getUserByEmail(email: string): Promise<UserDomain | null>;
    getAllUsers(): Promise<UserDomain[]>;
}
//# sourceMappingURL=UserAdapter.d.ts.map