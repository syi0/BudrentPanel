import { useState, useCallback } from "react";
import Navbar from "../NavBar/NavBar";
import ContactsFilters from "./ContactsFilters";
import ContactsTable from "./ContactsTable";
import ContactModal from "../Modals/ContactModal";
import "./Contacts.css";

const EMPTY_FILTERS = {
    company: "",
    first_name: "",
    last_name: "",
    email: "",
    verified: ""
};

export default function ContactsPage() {
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [open, setOpen] = useState(false);
    const [editContact, setEditContact] = useState(null);

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const handleFiltersChange = useCallback((f) => {
        setFilters(f);
        setPage(1); // identycznie jak w Orders
    }, []);

    return (
        <>
            <Navbar />

            <div className="contacts-layout">
                <ContactsFilters
                    filters={filters}
                    onChange={handleFiltersChange}
                />

                <div>
                    <div className="clients-header">
                        <h2>Osoby kontaktowe</h2>
                        <button onClick={() => setOpen(true)}>
                            + Dodaj kontakt
                        </button>
                    </div>

                    <ContactsTable
                        filters={filters}
                        page={page}
                        onPageInfo={setPages}
                        onEdit={c => setEditContact(c)}
                    />

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
            </div>

            {(open || editContact) && (
                <ContactModal
                    contact={editContact}
                    onSuccess={() => setPage(1)}
                    onClose={() => {
                        setOpen(false);
                        setEditContact(null);
                    }}
                />
            )}
        </>
    );
}
