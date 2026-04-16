import { useEffect, useState } from "react";

export default function OrdersFilters({ onChange }) {
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("");
  const [processNumber, setProcessNumber] = useState("");
  const [responsible, setResponsible] = useState("");
  const [description, setDescription] = useState("");
  const [parts, setParts] = useState("");
  const [contact, setContact] = useState("");

  useEffect(() => {
    onChange({
      company: company.trim() || undefined,
      status: status || undefined,
      process_number: processNumber.trim() || undefined,
      responsible: responsible.trim() || undefined,
      description: description.trim() || undefined,
      parts: parts.trim() || undefined,
      contact: contact.trim() || undefined
    });
  }, [company, status, processNumber, responsible, description, parts, contact]);

  return (
    <div className="orders-filters">

      <input
        type="text"
        placeholder="Firma / kontakt"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <input
        type="text"
        placeholder="Nr procesu"
        value={processNumber}
        onChange={(e) => setProcessNumber(e.target.value)}
      />

      <input
        type="text"
        placeholder="Odpowiedzialny"
        value={responsible}
        onChange={(e) => setResponsible(e.target.value)}
      />

      <input
        type="text"
        placeholder="Opis"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="text"
        placeholder="Części"
        value={parts}
        onChange={(e) => setParts(e.target.value)}
      />

      <input
        type="text"
        placeholder="Osoba kontaktowa"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Wszystkie statusy</option>
        <option value="nowy">Nowy</option>
        <option value="w_realizacji">W realizacji</option>
        <option value="zakonczony">Zakończony</option>
        <option value="anulowany">Anulowany</option>
      </select>

    </div>
  );
}