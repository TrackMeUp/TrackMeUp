import { Navigate, Outlet } from 'react-router-dom';

export function PrivateRoute() {

    let user = null;

    try {
        
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            user = JSON.parse(storedUser);
        }
        
    } catch (err) {
        console.error("Error parsing user from localStorage:", err);
        localStorage.clear();
    }

    return user ? <Outlet /> : <Navigate to="/login" />;
}