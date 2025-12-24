import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./Login/Login";
import MainPanel from "./MainPanel/MainPanel";
import ProtectedRoute from "./ProtectedRoute";

// WŁAŚCIWE PANELE
import ContractorsPage from "./Contractors/ContractorsPage";
import ContactsPage from "./Contacts/ContactsPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* LOGIN */}
                <Route path="/" element={<LoginPage />} />

                {/* PANEL GŁÓWNY */}
                <Route
                    path="/panel"
                    element={
                        <ProtectedRoute>
                            <MainPanel />
                        </ProtectedRoute>
                    }
                />

                {/* KONTRAHENCI = FIRMY */}
                <Route
                    path="/contractors"
                    element={
                        <ProtectedRoute>
                            <ContractorsPage />
                        </ProtectedRoute>
                    }
                />

                {/* OSOBY KONTAKTOWE */}
                <Route
                    path="/contacts"
                    element={
                        <ProtectedRoute>
                            <ContactsPage />
                        </ProtectedRoute>
                    }
                />

                {/* FALLBACK */}
                <Route path="*" element={<Navigate to="/panel" replace />} />

            </Routes>
        </BrowserRouter>
    );
}
