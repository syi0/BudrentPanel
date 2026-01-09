import { useState, useCallback } from "react";
import Navbar from "../NavBar/NavBar";
import ContractorsFilters from "./ContractorsFilters";
import ContractorsTable from "./ContractorsTable";
import CompanyModal from "../Modals/CompanyModal";
import "./Contractors.css";

const EMPTY_FILTERS = {
    name: "",
    nip: "",
    city: "",
    account_manager: ""
};

export default function ContractorsPage() {
    const [filters, setFilters] = useState(EMPTY_FILTERS);

    const [open, setOpen] = useState(false);
    const [editCompany, setEditCompany] = useState(null);

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    // 🔑 trigger do wymuszenia odświeżenia tabeli (jak w Contacts)
    const [reload, setReload] = useState(0);

    const handleFiltersChange = useCallback((f) => {
        setFilters(f);
        setPage(1);
    }, []);

    return (
        <>
            <Navbar />

            <div className="contractors-layout">
                <ContractorsFilters
                    filters={filters}
                    onChange={handleFiltersChange}
                />

                <div>
                    <div className="clients-header">
                        <h2>Kontrahenci</h2>

                        <button
                            onClick={() => {
                                setEditCompany(null); // WAŻNE
                                setOpen(true);
                            }}
                        >
                            + Dodaj firmę
                        </button>
                    </div>

                    <ContractorsTable
                        filters={filters}
                        page={page}
                        reload={reload}
                        onPageInfo={setPages}
                        onEdit={(c) => {
                            setEditCompany(c);
                            setOpen(false);
                        }}
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

            {(open || editCompany) && (
                <CompanyModal
                    company={editCompany}
                    onSuccess={() => {
                        setPage(1);
                        setReload(r => r + 1); // 🔥 WYMUSZENIE ODŚWIEŻENIA
                        setOpen(false);
                        setEditCompany(null);
                    }}
                    onClose={() => {
                        setOpen(false);
                        setEditCompany(null);
                    }}
                />
            )}
        </>
    );
}
