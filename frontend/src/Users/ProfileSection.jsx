import { useState } from "react";
import axios from "axios";
import "./Users.css";

export default function ProfileSection({ me, setMe }) {
    const [firstName, setFirstName] = useState(me.first_name || "");
    const [lastName, setLastName] = useState(me.last_name || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passSaved, setPassSaved] = useState(false);
    const [saved, setSaved] = useState(false);

    const save = async () => {
        await axios.put("http://localhost:3001/api/me", {
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
            <br/>
            <br/>

            <h3>Zmień hasło</h3> 

            <input
                type="password"
                placeholder="Aktualne hasło"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
            />

            <input
                type="password"
                placeholder="Nowe hasło"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
            />

            <button
                onClick={async () => {
                    await axios.put("http://localhost:3001/api/me/password", {
                        currentPassword,
                        newPassword
                    });

                    setCurrentPassword("");
                    setNewPassword("");
                    setPassSaved(true);
                    setTimeout(() => setPassSaved(false), 2000);
                }}
            >
                Zmień hasło
            </button>

            {passSaved && <span className="ok">Hasło zmienione</span>}

        </div>
    );
}
