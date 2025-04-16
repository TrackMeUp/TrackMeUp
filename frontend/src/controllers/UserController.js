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

        const fullName = `${user.first_name} ${user.last_name1} ${user.last_name2}`;

            localStorage.setItem("user_id", user.user_id);
            localStorage.setItem("user_email", user.email);
            localStorage.setItem("user_name", fullName);

        return {
            success: true,
            data: result.data,
        };
    }
}
