// Usuario "Administrador"
// Página de inicio del administrador

import { Link } from "react-router-dom";
import "../../styles/adminView.css"; // Importación del css de adminView

export function AdminView() {

    return (
        <h1>Bienvenido a la página de administración</h1>
/*
        <div className="admin-container">
            <div className="admin-card">
                <h2>Panel de control</h2>
                <div className="admin-buttons">
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
        </div>
        */
    );
}