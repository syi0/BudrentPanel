import NavBar from "../NavBar/NavBar";
import { useEffect, useState } from "react";
import axios from "axios";
import MissingProfileModal from "../Modals/MissingProfileModal";
import { useNavigate } from "react-router-dom";
import OrdersPage from "../Orders/OrdersPage";

axios.defaults.withCredentials = true;

export default function MainPanel() {

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3001/api/me")
            .then(res => {
                const user = res.data;

                if (!user.first_name || !user.last_name) {
                    setShowModal(true);
                }
            })
            .catch(() => navigate("/panel"));
    }, [navigate]);

    const goToSettings = () => {
        setShowModal(false);
        navigate("/settings");
    };

    return (
        <div>
            <NavBar />

            {showModal && (
                <MissingProfileModal onConfirm={goToSettings} />
            )}

            <div
                style={{
                    padding: "20px",
                    filter: showModal ? "blur(2px)" : "none",
                    pointerEvents: showModal ? "none" : "auto"
                }}
            >
                <OrdersPage />
            </div>
        </div>
    );
}
