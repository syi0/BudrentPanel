export default function OrdersTable({ orders, onOpen }) {
    return (
        <table className="orders-table">
            <thead>
                <tr>
                    <th>Numer</th>
                    <th>Firma / Kontakt</th>
                    <th>Status</th>
                    <th>Odpowiedzialny</th>
                    <th>Opis</th>
                </tr>
            </thead>
            <tbody>
                {orders.map(o => (
                    <tr key={o.id} onClick={() => onOpen(o)}>
                        <td>{o.process_number}</td>

                        <td>
                            {o.company_name
                                ? o.company_name
                                : o.contact_name || "—"}
                        </td>

                        <td>
                            <span className={`status status-${o.status}`}>
                                {o.status === "nowy" && "Nowe"}
                                {o.status === "przekazane" && "Przekazane"}
                                {o.status === "w_realizacji" && "W realizacji"}
                                {o.status === "ukonczone" && "Ukończone"}
                            </span>
                        </td>

                        <td>{o.responsible_name || "—"}</td>
                        <td>{o.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
