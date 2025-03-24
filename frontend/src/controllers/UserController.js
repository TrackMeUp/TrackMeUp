import { loginUser } from "../services/api/UserApiService";
import { validateLogin } from "./loginController"; // Mover a `UserController`?

export class UserController {
    async login(user, password) {
        if (!validateLogin(user, password)) {
            // Validación en frontend
            return { success: false };
        }

        const result = await loginUser({ user: user, password: password });

        if (!result.success) {
            return {
                success: false,
                errors: { server: result.error },
            };
        }

        return { success: true, data: result.data };
    }
}
