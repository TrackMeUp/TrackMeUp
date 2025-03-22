import { useState } from 'react'; // Para usar funcionalidades de React en versiones anteriores
//import './login.css';

export function Login() {

    // Validación del formulario (Cliente)
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");

    const validateLogin = (event) => {

        event.preventDefault(); // Evita el envío del formulario sin validar

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!user || !password) {
            alert("Debe rellenar todos los campos para iniciar sesión.");
            return;
        }

        if (!emailRegex.test(user)) {
            alert("El usuario debe ser un correo electrónico.");
            return;
        }

        if (password.length < 6) {
            alert("La contraseña debe tener al menos 6 caracteres.");
            return;
        }
    };


    return (

        <section>

            <form id="loginForm" action="login" onSubmit={validateLogin}>
                <div>
                    <label htmlFor="user">Usuario: </label>
                    <input type="text" id="user" name="user" value={user} onChange={(e) => setUser(e.target.value)} />
                </div>

                <div>
                    <label htmlFor="password">Contraseña: </label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
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

};