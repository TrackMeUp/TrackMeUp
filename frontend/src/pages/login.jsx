import { useState } from "react"; // Para usar funcionalidades de React en versiones anteriores
import { UserController } from "../controllers/UserController";
//import './login.css';

export function Login() {
    // Validación del formulario (Cliente)
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    const userController = new UserController();

    const handleLogin = async (event) => {
        // Controlador del botón "Iniciar sesión"
        event.preventDefault(); // Evita el envío del formulario sin validar

        const result = await userController.login(user, password);
    };

    return (
        <section>
            <form id="loginForm" action="login" onSubmit={handleLogin}>
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

                <div>
                    <button type="submit">Iniciar sesión</button>
                </div>

                <div>
                    <a href="">¿Has olvidado tu contraseña?</a>
                    {/* Completar ruta */}
                </div>
            </form>
        </section>
    );
}
