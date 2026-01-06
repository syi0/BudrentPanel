import axios from "axios";
import { useState } from "react";
import "./Users.css";

export default function AdminUsers({ users, setUsers }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("user");

    const addUser = async () => {
        if (!username || !password) return;

        const res = await axios.post("http://localhost:3001/api/users", {
            username,
            password,
            role,
            first_name: firstName,
            last_name: lastName
        });

        setUsers([...users, res.data]);

        setUsername("");
        setPassword("");
        setRole("user");
        setFirstName("");
        setLastName("");
    };

    const removeUser = async (id) => {
        if (!window.confirm("Usunąć użytkownika?")) return;

        await axios.delete(`http://localhost:3001/api/users/${id}`);
        setUsers(users.filter(u => u.id !== id));
    };

    return (
        <div className="card">
            <h3>Pracownicy</h3>
            <input
                placeholder="Login"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />

            <input
                placeholder="Hasło"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <input
                placeholder="Imię"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
            />

            <input
                placeholder="Nazwisko"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
            />


            <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>

            <button onClick={addUser}>Dodaj użytkownika</button>

            <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #eee" }} />

            {users.map(u => (
                <div className="row" key={u.id}>
                    <div>
                        <strong>{u.username}</strong>
                        <span className="role">{u.role}</span>
                    </div>
                    <button
                        onClick={async () => {
                            const pwd = prompt("Nowe hasło:");
                            if (!pwd) return;

                            await axios.put(
                                `http://localhost:3001/api/users/${u.id}/password`,
                                { newPassword: pwd }
                            );

                            alert("Hasło zmienione");
                        }}
                    >
                        Resetuj hasło
                    </button>


                    <button
                        className="danger"
                        onClick={() => removeUser(u.id)}
                        disabled={u.self}
                    >
                        Usuń
                    </button>
                </div>
            ))}
        </div>
    );
}
