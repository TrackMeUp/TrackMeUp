// Usuario "Administrador"
// Página de inicio del administrador

import { Link } from "react-router-dom";
import "../../styles/adminView.css"; // Importación del css de adminView

export function AdminView() {

    return (

        <div className="admin-container">
            <div className="admin-card">
                <h2>Panel de control</h2>
                <div className="admin-buttons">
                    <Link to="user_management">
                        <button>Gestión de Usuarios</button>
                    </Link>

                    <Link to="academic_management">
                        <button>Gestión Académica</button>
                    </Link>
{/*
                    <Link to="performance_management">
                        <button>Gestión de Rendimiento Académico</button>
                    </Link>
*/}
                </div>
            </div>
        </div>
    );
}
