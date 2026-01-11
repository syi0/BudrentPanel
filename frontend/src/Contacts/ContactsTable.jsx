import { useEffect, useState } from "react";
import api from "../api";

export default function ContactsTable({ filters, page, reload, onPageInfo, onEdit }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        api.get("/contacts", {
            params: {
                ...filters,
                page,
                limit: 20
            }
        })
            .then(res => {
                if (cancelled) return;
                setData(res.data.data || []);
                onPageInfo(res.data.pages || 1);
            })
            .catch(() => {
                if (!cancelled) setData([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [filters, page, reload]); 

    if (loading) {
        return <div className="table-wrapper">Ładowanie…</div>;
    }

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
                        <tr
                            key={c.id}
                            onClick={() => onEdit(c)}
                            style={{ cursor: "pointer" }}
                        >
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
