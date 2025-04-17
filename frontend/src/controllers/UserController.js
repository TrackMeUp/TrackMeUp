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

        const user = result.data.user;
        console.log("Usuario recibido:", user);

            localStorage.setItem("user_id", user.user_id);
            localStorage.setItem("user_email", user.email);
            localStorage.setItem("user_name", user.fullName);

        return {
            success: true,
            user: result.data.user,
        };
    }
}
