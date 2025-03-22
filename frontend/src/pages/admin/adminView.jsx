// Usuario "Administrador"

import { Link } from "react-router-dom";

export default function AdminView() {

    return (

        <div>
            <h1>Panel de control del Administrador</h1>
            <div>
                <Link to="user_management">
                    <button>Gestión de usuarios</button>
                </Link>

                <Link to="academic_management">
                    <button>Gestión de curso académico</button>
                </Link>

                <Link to="admin_performance">
                    <button>Gestión de rendimiento académico</button>
                </Link>

            </div>
        </div>
    );
}