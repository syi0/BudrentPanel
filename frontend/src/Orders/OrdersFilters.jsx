import { useEffect, useState } from "react";

export default function OrdersFilters({ onChange }) {
    const [company, setCompany] = useState("");
    const [status, setStatus] = useState("");

    // 🔁 LIVE FILTER
    useEffect(() => {
        const filters = {
            company: company.trim() || undefined,
            status: status || undefined
        };

        onChange(filters);
    }, [company, status, onChange]);

    return (
        <div className="orders-filters">
            <input
                type="text"
                placeholder="Filtruj po firmie"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
            />

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="">Wszystkie statusy</option>
                <option value="nowy">Nowe</option>
                <option value="przekazane">Przekazane</option>
                <option value="w_realizacji">W realizacji</option>
            </select>
        </div>
    );
}
