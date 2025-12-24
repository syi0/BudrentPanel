import { useEffect, useState } from "react";
import api from "../api";

export default function ContactsTable({ filters, onEdit }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        api.get("/contacts", { params: filters })
            .then(res => setData(res.data || []))
            .catch(() => setData([]));
    }, [filters]);

    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Imię</th>
                        <th>Nazwisko</th>
                        <th>Firma</th>
                        <th>Email</th>
                        <th>Zw.</th>
                        <th>Marketing</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 && (
                        <tr>
                            <td colSpan="6">Brak wyników</td>
                        </tr>
                    )}

                    {data.map(c => (
                        <tr key={c.id} onClick={() => onEdit(c)}>
                            <td>{c.first_name || "—"}</td>
                            <td>{c.last_name || "—"}</td>
                            <td>{c.company_name || "—"}</td>
                            <td>{c.email || "—"}</td>
                            <td>{c.verified ? "✔" : "✖"}</td>
                            <td>{c.marketing_consent ? "✔" : "✖"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
