import { loginUser } from "../services/api/UserApiService";
import { validateLogin } from "./loginController"; // Mover a `UserController`?

export class UserController {
    async login(email, password) {
        if (!validateLogin(email, password)) {
            // Validación en frontend
            return { success: false };
        }

        const result = await loginUser({ email: email, password: password });

        if (!result.success) {
            return {
                success: false,
                errors: { server: result.error },
            };
        }

        return {
            success: true,
            data: result.data,
        };
    }
}
