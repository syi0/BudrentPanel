import { useEffect, useState, useCallback } from "react";
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

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const handleFiltersChange = useCallback((f) => {
        setFilters(f);
        setPage(1);
    }, []);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await api.get("/processes", {
                params: {
                    ...filters,
                    page,
                    limit: 20
                }
            });

            setOrders(res.data.data);
            setPages(res.data.pages);
        } catch (err) {
            console.error("Błąd pobierania zleceń:", err);
        }
    }, [filters, page]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);


    return (
        <div className="orders-page">
            <div className="orders-content">
                <h2>Zlecenia</h2>

                <div className="orders-toolbar">
                    <OrdersFilters onChange={handleFiltersChange} />

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
                        fetchOrders(); 
                    }}
                />

            )}

            <div className="pagination">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                >
                    ◀ Poprzednia
                </button>

                <span>
                    Strona {page} z {pages}
                </span>

                <button
                    disabled={page === pages}
                    onClick={() => setPage(p => p + 1)}
                >
                    Następna ▶
                </button>
            </div>
        </div>
    );
}
