import { useEffect, useState } from "react";
import api from "../api";
import "./Modal.css";

export default function ContactModal({ contact, onClose, onSuccess }) {
    const [companies, setCompanies] = useState([]);

    const [form, setForm] = useState({
        company_id: contact?.company_id || "",
        first_name: contact?.first_name || "",
        last_name: contact?.last_name || "",
        email: contact?.email || "",
        verified: !!contact?.verified,
        marketing_consent: !!contact?.marketing_consent
    });

    useEffect(() => {
        api.get("/companies")
            .then(res => {
                const list = res.data?.data;
                setCompanies(Array.isArray(list) ? list : []);
            })
            .catch(() => setCompanies([]));
    }, []);

    const save = async () => {
        if (!form.company_id) {
            alert("Musisz wybrać firmę");
            return;
        }

        const payload = {
            company_id: form.company_id,
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            email: form.email.trim(),
            verified: form.verified ? 1 : 0,
            marketing_consent: form.marketing_consent ? 1 : 0
        };

        try {
            if (contact?.id) {
                await api.put(`/contacts/${contact.id}`, payload);
            } else {
                await api.post("/contacts", payload);
            }

            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("Błąd zapisu kontaktu:", err);
            alert("Nie udało się zapisać kontaktu");
        }
    };

    const remove = async () => {
        if (!contact?.id) return;

        if (!window.confirm("Czy na pewno chcesz usunąć ten kontakt?")) return;

        try {
            await api.delete(`/contacts/${contact.id}`);
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("Błąd usuwania kontaktu:", err);
            alert("Nie udało się usunąć kontaktu");
        }
    };

    if (!Array.isArray(companies) || companies.length === 0) {
        return (
            <div className="modal-backdrop">
                <div className="modal">
                    <h3>Brak firm</h3>
                    <p>Najpierw dodaj firmę, aby móc utworzyć kontakt.</p>
                    <button onClick={onClose}>Zamknij</button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>{contact ? "Edytuj kontakt" : "Dodaj kontakt"}</h3>

                <select
                    value={form.company_id}
                    onChange={e =>
                        setForm({ ...form, company_id: e.target.value })
                    }
                >
                    <option value="">— wybierz firmę —</option>
                    {companies.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <input
                    placeholder="Imię"
                    value={form.first_name}
                    onChange={e =>
                        setForm({ ...form, first_name: e.target.value })
                    }
                />

                <input
                    placeholder="Nazwisko"
                    value={form.last_name}
                    onChange={e =>
                        setForm({ ...form, last_name: e.target.value })
                    }
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={e =>
                        setForm({ ...form, email: e.target.value })
                    }
                />

                <label>
                    <input
                        type="checkbox"
                        checked={form.verified}
                        onChange={e =>
                            setForm({ ...form, verified: e.target.checked })
                        }
                    />
                    Zweryfikowany
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={form.marketing_consent}
                        onChange={e =>
                            setForm({ ...form, marketing_consent: e.target.checked })
                        }
                    />
                    Marketing
                </label>

                <div className="modal-actions">
                    {contact?.id && (
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
