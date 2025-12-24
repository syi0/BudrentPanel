import { useState } from "react";
import api from "../api";
import "./Modal.css";

export default function CompanyModal({ company, onClose, onSuccess }) {
    const [form, setForm] = useState(
        company || {
            name: "",
            nip: "",
            address: "",
            postal_code: "",
            city: "",
            account_manager: ""
        }
    );

    const save = async () => {
        if (!form.name.trim()) {
            alert("Nazwa firmy jest wymagana");
            return;
        }

        try {
            if (company?.id) {
                await api.put(`/companies/${company.id}`, form);
            } else {
                await api.post("/companies", form);
            }

            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("Błąd zapisu firmy:", err);
            alert("Nie udało się zapisać firmy");
        }
    };

    const remove = async () => {
        if (!company?.id) return;

        const ok = window.confirm(
            "Czy na pewno chcesz usunąć tę firmę?\n\nUWAGA: spowoduje to usunięcie powiązań z kontaktami."
        );
        if (!ok) return;

        try {
            await api.delete(`/companies/${company.id}`);
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("Błąd usuwania firmy:", err);
            alert("Nie udało się usunąć firmy");
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>{company ? "Edytuj firmę" : "Dodaj firmę"}</h3>

                <input
                    placeholder="Nazwa firmy"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                />

                <input
                    placeholder="NIP"
                    value={form.nip}
                    onChange={e => setForm({ ...form, nip: e.target.value })}
                />

                <input
                    placeholder="Adres"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                />

                <input
                    placeholder="Kod pocztowy"
                    value={form.postal_code}
                    onChange={e => setForm({ ...form, postal_code: e.target.value })}
                />

                <input
                    placeholder="Miasto"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                />

                <input
                    placeholder="Główny opiekun"
                    value={form.account_manager}
                    onChange={e => setForm({ ...form, account_manager: e.target.value })}
                />

                <div className="modal-actions">
                    {company?.id && (
                        <button className="danger" onClick={remove}>
                            Usuń
                        </button>
                    )}
                    <button onClick={save}>Zapisz</button>
                    <button onClick={onClose}>Anuluj</button>
                </div>
            </div>
        </div>
    );
}
