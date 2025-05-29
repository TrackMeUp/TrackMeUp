// Formulario de acceso

import { useState } from "react"; // Importa el hook useState de la biblioteca de React
import { UserController } from "../controllers/UserController"; // Importa el fichero userController.js

import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/login.css'; // Incluye el estilo CSS del fichero login.css
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate de la biblioteca react-router-dom

import logo from '../assets/TrackMeUp.svg'; // Importa la imagen del logo

export function Login() {

    // Validación del formulario (Cliente)
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const userController = new UserController();

    const handleLogin = async (event) => {
        // Controlador del botón "Iniciar sesión"
        event.preventDefault(); // Evita el envío del formulario sin validar

        const result = await userController.login(user, password);

        if (result.success) {

            localStorage.setItem("user", JSON.stringify(result.user));
            localStorage.setItem("user_role", result.user.role.name);

            // Para borrar datos de sesión al cerrar la ventana
            sessionStorage.setItem("session_alive", "true");

            if (result.user.role.name === "admin") {

                navigate('/admin');
            }

            else {

                navigate('/home');
            }


        } else {
            alert(result.errors.server)
        }
    };

    const handleChangePassw = async (event) => {
        // Controlador del botón "¿Has olvidado tu contraseña?
        event.preventDefault();
        alert('El centro de estudios se pondrá en contacto contigo próximamente para proporcionarte una nueva contraseña.');
    };


    return (

        <div className='layout-login'>

            {/* Formulario */}
            <section>
                <form id="loginForm" action="login" onSubmit={handleLogin}>
                    <div className="login-containter">
                        <div className="login-card">

                            <p> <img className="logo" alt="Logotipo Track Me Up" src={logo} /> </p>

                            <h3 className="login-title">Acceso</h3>

                            <div className="login-group">
                                <label htmlFor="user" className="form-label">Usuario: </label>
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
                                <label htmlFor="password" className="form-label">Contraseña: </label>
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
                                <a href="#" onClick={handleChangePassw}>¿Has olvidado tu contraseña?</a>
                            </div>

                        </div>
                    </div>
                </form>
            </section>

        </div>
    );
}
