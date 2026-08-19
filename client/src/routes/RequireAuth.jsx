import { Navigate, Outlet } from "react-router"
import useAuth from "../features/auth/useAuth";

export default function RequireAuth() {
    const { isAuthenticated, loading } = useAuth();

    if(loading) return;
    if(!isAuthenticated) return <Navigate to="/login" />;
    
    return <Outlet />
}