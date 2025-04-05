import { useState } from "react"; // Para usar funcionalidades de React en versiones anteriores
import { UserController } from "../controllers/UserController";
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/login.css';
import { Link } from "react-router-dom";


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
                <div className="login-containter">
                    <div className="login-card">
                        <h3 className="login-title">Acceso</h3>
                        <div className="login-group">
                            <label htmlFor="user" className="form-label">Usuario: </label> <br />
                            <input
                                type="text"
                                className="form-data"
                                id="user"
                                name="user"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                            />

                        </div>

                        <div className="login-group">
                            <label htmlFor="password" className="form-label">Contraseña: </label> <br />
                            <input
                                type="password"
                                className="form-data"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <button type="submit" className="login-button">Iniciar sesión</button>
                        </div>

                        <div className="passw-button">
                            <Link to=" "> {/* Completar ruta */}
                                ¿Has olvidado tu contraseña?
                            </Link>

                        </div>

                        {/*<Link to="/admin" className="btn btn-primary mt-5">
                            Enlace temporal: vista de Administrador
                        </Link>*/}

                    </div>
                </div>
            </form>
        </section>
    );
}