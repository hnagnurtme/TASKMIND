import { LoginModel } from "./LoginModel";
import { RegisterModel } from "./RegisterModel";
import { AuthRepo } from "./AuthRepo";

export const AuthService = {
    register: async (data: RegisterModel) => {
        const { email, password, name } = data;
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }
        return await AuthRepo.register(email, password, name);

    },
    login: async (data: LoginModel) => {
        const { email, password } = data;
        if (!email || !password) {
            throw new Error("Email and password are required");
        }
        return await AuthRepo.login(email, password);
    },
    logout: async () => {
        return { success: true };
    }
}