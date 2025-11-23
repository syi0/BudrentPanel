import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Logo from '../assets/budrent-logo-inverted.png'

axios.defaults.withCredentials = true;

export default function LoginPage() {
    const nav = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/login", { username, password });
            nav("/panel");
        } catch {
            setError("Nieprawidłowe dane logowania");
        }
    };

    return (
        <div className="login-wrapper">
            <form className="login-box" onSubmit={handleLogin}>
                <img src={Logo} alt="" />

                <input
                    placeholder="Login"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="login-error">{error}</div>

                <button className="login-btn">Zaloguj</button>
            </form>
        </div>
    );
}
