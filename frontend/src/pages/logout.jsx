import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function LogOut() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Solo ejecuta si no estamos ya en /login para evitar bucle
    if (location.pathname !== '/login') {
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login', { replace: true }); // Reemplaza en historial para evitar loops
    }
  }, [location, navigate]);

  return null; // No renderiza nada
}