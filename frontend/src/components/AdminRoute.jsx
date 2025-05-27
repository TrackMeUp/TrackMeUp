import { Navigate, Outlet } from 'react-router-dom';

export function AdminRoute() {
    const role = localStorage.getItem("user_role");

    return role === "admin" ? <Outlet /> : <Navigate to="/admin" />;
}
