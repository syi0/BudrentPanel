export default function OrdersTable({ orders, onOpen }) {
    return (
        <table className="orders-table">
            <thead>
                <tr>
                    <th>Numer</th>
                    <th>Firma</th>
                    <th>Odpowiedzialny</th>
                    <th>Opis</th>
                </tr>
            </thead>
            <tbody>
                {orders.map(o => (
                    <tr key={o.id} onClick={() => onOpen(o)}>
                        <td>{o.process_number}</td>
                        <td>{o.company_name}</td>
                        <td>{o.responsible_name}</td>
                        <td>{o.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
