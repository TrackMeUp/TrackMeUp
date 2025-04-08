// Cerrar sesión

import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate de la biblioteca react-router-dom
import { useEffect } from "react"; // Importa el hook useEffect de la biblioteca react-router-dom

export function LogOut() {

    const navigate = useNavigate();
    
    useEffect(() => {
        localStorage.clear();
        navigate('/login');
    }, [navigate]);
    
    return null;
}