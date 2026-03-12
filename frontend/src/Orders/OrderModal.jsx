import { useEffect, useState } from "react";
import api from "../api";
import Select from "react-select";
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
                address: order.address || ""
            });

            setClientType(order.company_id ? "company" : "individual");

        } else {

            setClientType("company");

            setForm({
                company_id: "",
                contact_id: "",
                responsible_user_id: "",
                description: "",
                advance_amount: "",
                status: "nowy",
                address: ""
            });
        }

    }, [order]);


    const userOptions = users.map(u => ({
        value: u.id,
        label: u.name
    }));

    const companyOptions = companies.map(c => ({
        value: c.id,
        label: c.name
    }));

    const contactOptions = contacts
        .filter(
            c =>
                clientType === "individual" ||
                !form.company_id ||
                c.company_id == form.company_id
        )
        .map(c => ({
            value: c.id,
            label: c.name
        }));


    const save = async () => {

        try {

            const payload = { ...form };

            if (clientType === "company" && !payload.company_id) {
                alert("Wybierz firmę dla zlecenia firmowego");
                return;
            }

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

                        <Select
                            options={userOptions}
                            placeholder="Wybierz użytkownika"
                            value={userOptions.find(o => o.value == form.responsible_user_id) || null}
                            onChange={option =>
                                setForm({
                                    ...form,
                                    responsible_user_id: option?.value || ""
                                })
                            }
                            isSearchable
                            maxMenuHeight={200}
                        />


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

                                <Select
                                    options={companyOptions}
                                    placeholder="Wybierz lub wpisz firmę"
                                    value={companyOptions.find(o => o.value == form.company_id) || null}
                                    onChange={option =>
                                        setForm({
                                            ...form,
                                            company_id: option?.value || "",
                                            contact_id: ""
                                        })
                                    }
                                    isSearchable
                                    maxMenuHeight={200}
                                />

                            </>

                        )}


                        <label>Nazwa osoby kontaktowej</label>

                        <Select
                            options={contactOptions}
                            placeholder="Wybierz osobę kontaktową"
                            value={contactOptions.find(o => o.value == form.contact_id) || null}
                            onChange={option =>
                                setForm({
                                    ...form,
                                    contact_id: option?.value || ""
                                })
                            }
                            isSearchable
                            maxMenuHeight={200}
                        />


                        <label>Adres</label>

                        <input
                            type="text"
                            value={form.address}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    address: e.target.value
                                })
                            }
                        />

                    </div>



                    <div className="modal-col">

                        <label>Opis zlecenia</label>

                        <textarea
                            value={form.description}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    description: e.target.value
                                })
                            }
                        />

                        <label>Zaliczka</label>

                        <input
                            type="number"
                            value={form.advance_amount}
                            onChange={e =>
                                setForm({
                                    ...form,
                                    advance_amount: e.target.value
                                })
                            }
                        />

                    </div>

                </div>


                <div className="modal-footer">

                    <select
                        value={form.status}
                        onChange={e =>
                            setForm({
                                ...form,
                                status: e.target.value
                            })
                        }
                    >
                        <option value="nowy">Nowe</option>
                        <option value="przekazane">Przekazane</option>
                        <option value="w_realizacji">W realizacji</option>
                        <option value="ukonczone">Ukończone</option>
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