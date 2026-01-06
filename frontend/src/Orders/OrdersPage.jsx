import { useEffect, useState } from "react";
import api from "../api";
import OrdersTable from "./OrdersTable";
import OrdersFilters from "./OrdersFilters";
import OrderModal from "./OrderModal";
import "./Orders.css";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filters, setFilters] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/processes", {
                    params: filters
                });
                setOrders(res.data);
            } catch (err) {
                console.error("Błąd pobierania zleceń:", err);
            }
        };

        fetchOrders();
    }, [filters]);

    return (
        <div className="orders-page">
            <div className="orders-content">
                <h2>Nowe zlecenia</h2>

                <div className="orders-toolbar">
                    <OrdersFilters onChange={setFilters} />

                    <button
                        className="primary-btn"
                        onClick={() => {
                            setEditingOrder(null);
                            setModalOpen(true);
                        }}
                    >
                        + Dodaj proces
                    </button>
                </div>


                <OrdersTable
                    orders={orders}
                    onOpen={(order) => {
                        setEditingOrder(order);
                        setModalOpen(true);
                    }}
                />
            </div>

            {modalOpen && (
                <OrderModal
                    order={editingOrder}
                    onClose={() => setModalOpen(false)}
                    onSaved={() => {
                        setModalOpen(false);
                        setFilters({ ...filters }); 
                    }}
                />
            )}
        </div>
    );
}
