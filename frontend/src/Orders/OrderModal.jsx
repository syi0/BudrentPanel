import { useEffect, useState } from "react";
import api from "../api";
import Select from "react-select";
import "./Orders.css";
import generateProtocol from "./generateProtocol";

export default function OrderModal({ order, onClose, onSaved }) {
  const [clientType, setClientType] = useState("company");

  const [form, setForm] = useState({
    company_id: "",
    contact_id: "",
    responsible_user_id: "",
    description: "",
    advance_amount: "",
    settlement: "",
    parts_used: "",
    status: "nowy",
    address: "",
    address_mode: "company"
  });

  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedCompany = companies.find(
    c => c.id === Number(form.company_id)
  );

  const selectedContact = contacts.find(
    c => c.id === Number(form.contact_id)
  );

  // ---- helpers ----
  const getCompanyAddress = (c) => {
    if (!c) return "";
    return [c.address, c.postal_code, c.city]
      .filter(Boolean)
      .join(", ");
  };

  // ---- load data + init ----
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [cRes, ctRes, uRes] = await Promise.all([
          api.get("/companies2"),
          api.get("/contacts2"),
          api.get("/users2")
        ]);

        if (cancelled) return;

        setCompanies(cRes.data || []);
        setContacts(ctRes.data || []);
        setUsers(uRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();

    if (order) {
      setForm({
        company_id: order.company_id || "",
        contact_id: order.contact_id || "",
        responsible_user_id: order.responsible_user_id || "",
        description: order.description || "",
        advance_amount: order.advance_amount || "",
        settlement: order.settlement || "",
        parts_used: order.parts_used || "",
        status: order.status || "nowy",
        address: order.address || "",
        address_mode: order.address ? "custom" : "company"
      });

      setClientType(order.company_id ? "company" : "individual");
    }

    return () => {
      cancelled = true;
    };
  }, [order]);

  // ---- sync company address ONLY when company mode active ----
  useEffect(() => {
    if (form.address_mode !== "company") return;

    if (!selectedCompany) return;

    setForm(f => ({
      ...f,
      address: getCompanyAddress(selectedCompany)
    }));
  }, [form.company_id, form.address_mode, selectedCompany]);

  // ---- options ----
  const userOptions = users.map(u => ({
    value: u.id,
    label: [u.first_name, u.last_name].filter(Boolean).join(" ")
  }));

  const companyOptions = companies.map(c => ({
    value: c.id,
    label: c.name
  }));

  const contactOptions = contacts
    .filter(c =>
      clientType === "individual" ||
      c.company_id === Number(form.company_id)
    )
    .map(c => ({
      value: c.id,
      label: [c.first_name, c.last_name].filter(Boolean).join(" ")
    }));

  const statusOptions = [
    { value: "nowy", label: "Nowy" },
    { value: "w_realizacji", label: "W realizacji" },
    { value: "zakonczony", label: "Zakończony" },
    { value: "anulowany", label: "Anulowany" }
  ];

  const addressOptions = [
    { value: "company", label: "Adres firmy" },
    { value: "custom", label: "Inny adres" }
  ];

  // ---- save ----
  const save = async () => {
    try {
      setLoading(true);

      const payload = {
        ...form,
        company_id:
          clientType === "individual"
            ? null
            : form.company_id
            ? Number(form.company_id)
            : null,
        contact_id: form.contact_id ? Number(form.contact_id) : null,
        responsible_user_id: form.responsible_user_id
          ? Number(form.responsible_user_id)
          : null,
        advance_amount:
          form.advance_amount === "" ? null : Number(form.advance_amount),
        settlement:
          form.settlement === "" ? null : Number(form.settlement)
      };

      if (order?.id) {
        await api.put(`/processes/${order.id}`, payload);
      } else {
        await api.post("/processes", payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Błąd zapisu");
    } finally {
      setLoading(false);
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
              value={userOptions.find(o => o.value === form.responsible_user_id)}
              onChange={o =>
                setForm({ ...form, responsible_user_id: o?.value || "" })
              }
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
                <label>Firma</label>
                <Select
                  options={companyOptions}
                  value={companyOptions.find(o => o.value === form.company_id)}
                  onChange={o =>
                    setForm({
                      ...form,
                      company_id: o?.value || "",
                      contact_id: ""
                    })
                  }
                />
              </>
            )}

            <label>Osoba kontaktowa</label>
            <Select
              options={contactOptions}
              value={contactOptions.find(o => o.value === form.contact_id)}
              onChange={o =>
                setForm({ ...form, contact_id: o?.value || "" })
              }
            />

            {selectedContact && (
              <div className="contact-preview">
                <strong>
                  {selectedContact.first_name}
                  {selectedContact.last_name
                    ? ` ${selectedContact.last_name}`
                    : ""}
                </strong>
                <div>{selectedContact.phone || "Brak telefonu"}</div>
              </div>
            )}

            <label>Adres</label>

            <Select
              options={addressOptions}
              value={addressOptions.find(o => o.value === form.address_mode)}
              onChange={(o) => {
                const mode = o.value;

                setForm(f => ({
                  ...f,
                  address_mode: mode,
                  address:
                    mode === "company"
                      ? getCompanyAddress(selectedCompany)
                      : ""
                }));
              }}
            />

            {form.address_mode === "custom" ? (
              <textarea
                placeholder="Wpisz adres"
                value={form.address}
                onChange={e =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            ) : (
              <input value={form.address} disabled />
            )}
          </div>

          <div className="modal-col">

            <label>Opis</label>
            <textarea
              value={form.description}
              onChange={e =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <label>Status</label>
            <Select
              options={statusOptions}
              value={statusOptions.find(o => o.value === form.status)}
              onChange={o =>
                setForm({ ...form, status: o.value })
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

            <label>Rozliczenie</label>
            <input
              type="number"
              value={form.settlement}
              onChange={e =>
                setForm({ ...form, settlement: e.target.value })
              }
            />

            <label>Wymienione części</label>
            <textarea
              value={form.parts_used}
              onChange={e =>
                setForm({ ...form, parts_used: e.target.value })
              }
            />
          </div>
        </div>

        <div className="modal-footer">

          {order?.id && (
            <>
              <button
                className="delete-btn"
                onClick={async () => {
                  if (!window.confirm("Na pewno usunąć?")) return;
                  await api.delete(`/processes/${order.id}`);
                  onSaved();
                  onClose();
                }}
              >
                Usuń
              </button>

              <button
                onClick={() =>
                  generateProtocol({
                    form,
                    company: selectedCompany,
                    contact: selectedContact,
                    processNumber: order?.process_number
                  })
                }
              >
                Protokół
              </button>
            </>
          )}

          <button onClick={save} disabled={loading}>
            {loading ? "Zapisywanie..." : "Zapisz"}
          </button>

          <button onClick={onClose}>Anuluj</button>
        </div>
      </div>
    </div>
  );
}