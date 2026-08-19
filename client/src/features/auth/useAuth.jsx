import { useState, useEffect } from "react";
import { checkSession } from "./services/authAPI";

export default function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getSession() {
            setError(null);
            
            try {
                const { session } = await checkSession();
                setIsAuthenticated(session);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        getSession()
    },[])

    return( {isAuthenticated, loading, error})
}