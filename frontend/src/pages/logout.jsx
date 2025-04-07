// Cerrar sesión
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function LogOut() {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.clear();
        navigate('/login');
    }, [navigate]);
    return null;
}