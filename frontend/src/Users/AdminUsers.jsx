import axios from "axios";
import "./Users.css";

export default function AdminUsers({ users, setUsers }) {

    const removeUser = async (id) => {
        if (!window.confirm("Usunąć użytkownika?")) return;

        await axios.delete(`http://localhost:3001/users/${id}`);
        setUsers(users.filter(u => u.id !== id));
    };

    return (
        <div className="card">
            <h3>Pracownicy</h3>

            {users.map(u => (
                <div className="row" key={u.id}>
                    <div>
                        <strong>{u.username}</strong>
                        <span className="role">{u.role}</span>
                    </div>

                    <button onClick={() => removeUser(u.id)}>
                        Usuń
                    </button>
                </div>
            ))}
        </div>
    );
}
