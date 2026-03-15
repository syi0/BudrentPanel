import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

axios.defaults.withCredentials = true;

export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        axios.get("http://87.106.187.114:3001/session")
            .then(res => {
                setAuth(res.data.logged);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Ładowanie...</div>;
    if (!auth) return <Navigate to="/" />;
    return children;
}
