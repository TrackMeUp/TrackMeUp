import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function PrivateRoute() {
  const location = useLocation();
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    localStorage.clear();
  }

  if (!user) {
    // Si ya estamos en /login, no redirigir para evitar bucle
    if (location.pathname === '/login') {
      return <Outlet />;
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
