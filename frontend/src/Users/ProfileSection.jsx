import { useState } from "react";
import axios from "axios";
import "./Users.css";

export default function ProfileSection({ me, setMe }) {
    const [firstName, setFirstName] = useState(me.first_name || "");
    const [lastName, setLastName] = useState(me.last_name || "");
    const [saved, setSaved] = useState(false);

    const save = async () => {
        await axios.put("http://localhost:3001/me", {
            first_name: firstName,
            last_name: lastName
        });

        setMe({ ...me, first_name: firstName, last_name: lastName });

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="card">
            <h3>Mój profil</h3>

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

            <button onClick={save}>Zapisz</button>
            {saved && <span className="ok">Zapisano</span>}
        </div>
    );
}
