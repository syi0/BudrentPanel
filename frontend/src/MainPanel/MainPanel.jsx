import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MainPanel() {
    const nav = useNavigate();

    const logout = async () => {
        await axios.post("http://localhost:3001/logout");
        nav("/");
    };

    return (
        <div>
            <h1>Panel główny</h1>
            <button onClick={logout}>Wyloguj</button>
        </div>
    );
}
