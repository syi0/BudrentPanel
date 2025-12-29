import { useEffect, useState } from "react";
import axios from "axios";
import ProfileSection from "../Users/ProfileSection";
import AdminUsers from "../Users/AdminUsers";
import "./Settings.css";

axios.defaults.withCredentials = true;

export default function SettingsPage() {
    const [me, setMe] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3001/me")
            .then(res => setMe(res.data));

        axios.get("http://localhost:3001/users")
            .then(res => setUsers(res.data))
            .catch(() => {});
    }, []);

    if (!me) return null;

    return (
        <div className="settings-page">
            <h2>Ustawienia</h2>

            <ProfileSection me={me} setMe={setMe} />

            {me.role === "admin" && (
                <AdminUsers users={users} setUsers={setUsers} />
            )}
        </div>
    );
}
