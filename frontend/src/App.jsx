import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Login/Login";
import MainPanel from "./MainPanel/MainPanel";
import ProtectedRoute from "./ProtectedRoute";
import ContractorsPage from "./Contractors/ContractorsPage";
import ContactsPage from "./Contacts/ContactsPage";
import SettingsPage from './Settings/SettingsPage'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<LoginPage />} />

                <Route
                    path="/panel"
                    element={
                        <ProtectedRoute>
                            <MainPanel />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contractors"
                    element={
                        <ProtectedRoute>
                            <ContractorsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contacts"
                    element={
                        <ProtectedRoute>
                            <ContactsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <SettingsPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/panel" replace />} />

            </Routes>
        </BrowserRouter>
    );
}
