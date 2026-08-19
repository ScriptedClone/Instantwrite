import { Navigate, Outlet } from "react-router"
import useAuth from "../features/auth/useAuth";

export default function RequireGuest() {
    const { isAuthenticated, loading } = useAuth();

    if(loading) return;
    if(isAuthenticated) return <Navigate to="/home" />;
    
    return <Outlet />
}