// Formulario de acceso

import { useState } from "react"; // Importa el hook useState de la biblioteca de React
import { UserController } from "../controllers/UserController"; // Importa el fichero userController.js

import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/login.css'; // Incluye el estilo CSS del fichero login.css
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate de la biblioteca react-router-dom

import { Header } from '../components/Header'; // Incluye la cabecera en el login


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
            localStorage.setItem("user", user);
            navigate('/home');
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

        // Cabecera
        <div className='layout'>
            <Header />

            {/* Formulario */}
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
                                <a href="#" onClick={handleChangePassw}>¿Has olvidado tu contraseña?</a>
                            </div>

                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
}