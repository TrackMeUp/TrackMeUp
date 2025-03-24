import { useState } from "react";
import { UserController } from "../controllers/UserController";

export function Login({ onLogin }) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const userController = new UserController();

    const handleLogin = async (event) => {
        event.preventDefault();

        // Validación del login (por ejemplo, llamada a validateLogin)
        const isValid = validateLogin(user, password);
        if (!isValid) return;

        const result = await userController.login(user, password);
        if (result.success) {
            // Si el login es exitoso, cambia el estado de autenticación
            onLogin();  // Llama a la función que pasaste como prop
        } else {
            setError("Error en el inicio de sesión. Intenta nuevamente.");
        }
    };

    return (
        <section>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="user">Usuario: </label>
                    <input
                        type="text"
                        id="user"
                        name="user"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña: </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>} {/* Mostrar error */}
                <div>
                    <button type="submit">Iniciar sesión</button>
                </div>
            </form>
        </section>
    );
}
