import "dotenv/config";
export type ReturnEnvironmentVars = {
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
};
declare const envs: ReturnEnvironmentVars;
export default envs;
//# sourceMappingURL=environment-vars.d.ts.map