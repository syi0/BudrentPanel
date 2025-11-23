import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Login/Login";
import MainPanel from "./MainPanel/MainPanel";
import ProtectedRoute from "./ProtectedRoute";

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
            </Routes>
        </BrowserRouter>
    );
}
