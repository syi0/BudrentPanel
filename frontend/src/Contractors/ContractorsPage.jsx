import { useState } from "react";
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
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <>
            <Navbar />

            <div className="contractors-layout">
                <ContractorsFilters
                    filters={filters}
                    onChange={setFilters}
                />

                <div>
                    <div className="clients-header">
                        <h2>Kontrahenci</h2>
                        <button onClick={() => setOpen(true)}>
                            + Dodaj firmę
                        </button>
                    </div>

                    <ContractorsTable
                        filters={filters}
                        refreshKey={refreshKey}
                        onEdit={c => setEditCompany(c)}
                    />

                </div>
            </div>

            {(open || editCompany) && (
                <CompanyModal
                    company={editCompany}
                    onSuccess={() => setRefreshKey(k => k + 1)}
                    onClose={() => {
                        setOpen(false);
                        setEditCompany(null);
                    }}
                />

            )}
        </>
    );
}
