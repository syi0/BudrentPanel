import { useEffect, useState } from "react";
import api from "../api";

export default function ContractorsTable({ filters, onEdit, refreshKey}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    let cancelled = false;
    setLoading(true);

    api.get("/companies", { params: filters })
        .then(res => {
            if (!cancelled) setData(res.data || []);
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
}, [filters, refreshKey]); 


    if (loading) {
        return <div className="table-wrapper">Ładowanie…</div>;
    }

    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Nazwa</th>
                        <th>NIP</th>
                        <th>Miasto</th>
                        <th>Opiekun</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 && (
                        <tr>
                            <td colSpan="4">Brak wyników</td>
                        </tr>
                    )}

                    {data.map(c => (
                        <tr key={c.id} onClick={() => onEdit(c)}>
                            <td>{c.name}</td>
                            <td>{c.nip || "—"}</td>
                            <td>{c.city || "—"}</td>
                            <td>{c.account_manager || "—"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
