import { useState } from "react";
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
    const [refreshKey, setRefreshKey] = useState(0);


    return (
        <>
            <Navbar />

            <div className="contacts-layout">
                <ContactsFilters
                    filters={filters}
                    onChange={setFilters}
                />

                <div>
                    <div className="clients-header">
                        <h2>Osoby kontaktowe</h2>
                        <button onClick={() => setOpen(true)}>
                            + Dodaj kontakt
                        </button>
                    </div>

                    <ContactsTable
                        key={refreshKey}
                        filters={filters}
                        onEdit={c => setEditContact(c)}
                    />
                </div>
            </div>

            {(open || editContact) && (
                <ContactModal
                    contact={editContact}
                    onSuccess={() => setRefreshKey(k => k + 1)}
                    onClose={() => {
                        setOpen(false);
                        setEditContact(null);
                    }}
                />
            )}
        </>
    );
}
