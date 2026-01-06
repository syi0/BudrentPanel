import { useEffect, useState } from "react";
import api from "../api";
import "./Orders.css";

export default function OrderModal({ order, onClose, onSaved }) {
    const [clientType, setClientType] = useState("company");

    const [form, setForm] = useState({
        company_id: "",
        contact_id: "",
        responsible_user_id: "",
        description: "",
        advance_amount: "",
        status: "nowy",
        address: ""
    });

    const [companies, setCompanies] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get("/companies2").then(res => setCompanies(res.data));
        api.get("/contacts2").then(res => setContacts(res.data));
        api.get("/users2").then(res => setUsers(res.data));

        if (order) {
            setForm({
                company_id: order.company_id || "",
                contact_id: order.contact_id || "",
                responsible_user_id: order.responsible_user_id || "",
                description: order.description || "",
                advance_amount: order.advance_amount || "",
                status: order.status || "nowy",
                address: ""
            });

            setClientType(order.company_id ? "company" : "individual");
        }
    }, [order]);

    const save = async () => {
        try {
            const { address, ...payload } = form;

            payload.company_id = payload.company_id || null;
            payload.contact_id = payload.contact_id || null;
            payload.responsible_user_id = payload.responsible_user_id || null;
            payload.advance_amount =
                payload.advance_amount === ""
                    ? null
                    : Number(payload.advance_amount);

            if (clientType === "individual") {
                payload.company_id = null;
            }

            if (order?.id) {
                await api.put(`/processes/${order.id}`, payload);
            } else {
                await api.post("/processes", payload);
            }

            onSaved();
        } catch (err) {
            console.error("Błąd zapisu procesu:", err);
        }
    };


    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>{order ? "Edytuj zlecenie" : "Nowe zlecenie serwisowe"}</h3>

                <div className="modal-grid">
                    <div className="modal-col">
                        <label>Odpowiedzialny</label>
                        <select
                            value={form.responsible_user_id}
                            onChange={e =>
                                setForm({ ...form, responsible_user_id: e.target.value })
                            }
                        >
                            <option value="">Wybierz</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>

                        <div className="toggle-group">
                            <button
                                type="button"
                                className={clientType === "company" ? "active" : ""}
                                onClick={() => setClientType("company")}
                            >
                                dla firmy
                            </button>
                            <button
                                type="button"
                                className={clientType === "individual" ? "active" : ""}
                                onClick={() => setClientType("individual")}
                            >
                                indywidualnie
                            </button>
                        </div>

                        {clientType === "company" && (
                            <>
                                <label>Nazwa firmy</label>
                                <select
                                    value={form.company_id}
                                    onChange={e =>
                                        setForm({ ...form, company_id: e.target.value })
                                    }
                                >
                                    <option value="">Wybierz firmę</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}

                        <label>Nazwa osoby kontaktowej</label>
                        <select
                            value={form.contact_id}
                            onChange={e =>
                                setForm({ ...form, contact_id: e.target.value })
                            }
                        >
                            <option value="">Wybierz</option>
                            {contacts
                                .filter(
                                    c =>
                                        clientType === "individual" ||
                                        !form.company_id ||
                                        c.company_id == form.company_id
                                )
                                .map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                        </select>

                        <label>Adres</label>
                        <input
                            type="text"
                            value={form.address}
                            onChange={e =>
                                setForm({ ...form, address: e.target.value })
                            }
                        />
                    </div>

                    <div className="modal-col">
                        <label>Opis zlecenia</label>
                        <textarea
                            value={form.description}
                            onChange={e =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />

                        <label>Zaliczka</label>
                        <input
                            type="number"
                            value={form.advance_amount}
                            onChange={e =>
                                setForm({ ...form, advance_amount: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <select
                        value={form.status}
                        onChange={e =>
                            setForm({ ...form, status: e.target.value })
                        }
                    >
                        <option value="nowy">Nowe</option>
                        <option value="przekazane">Przekazane</option>
                        <option value="w_realizacji">W realizacji</option>
                    </select>

                    {order?.id && (
                        <button
                            className="danger-btn"
                            onClick={async () => {
                                if (!confirm("Czy na pewno chcesz usunąć to zlecenie?")) return;
                                await api.delete(`/processes/${order.id}`);
                                onSaved();
                            }}
                        >
                            Usuń
                        </button>
                    )}

                    <div className="modal-actions">
                        <button className="primary-btn" onClick={save}>
                            Zapisz
                        </button>
                        <button className="secondary-btn" onClick={onClose}>
                            Anuluj
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
