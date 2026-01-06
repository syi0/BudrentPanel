import "./Navbar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

axios.defaults.withCredentials = true;

export default function Navbar() {
    const nav = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    const logout = async () => {
        await axios.post("http://localhost:3001/logout", {}, { withCredentials: true });
        nav("/");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const go = (path) => {
        setDropdownOpen(false);
        setMobileDropdownOpen(false);
        setMobileOpen(false);
        nav(path);
    };

    return (
        <>
            <nav className="navbar">
                <div className="nav-left">

                    <div className="nav-item" onClick={() => go("/panel")}>
                        <i className="fas fa-table"></i> Zlecenia
                    </div>

                    <div className="dropdown" ref={dropdownRef}>
                        <div
                            className="dropdown-header"
                            onClick={() => setDropdownOpen(v => !v)}
                        >
                            <i className="fas fa-users"></i> Klienci
                            <i className="fas fa-caret-down caret"></i>
                        </div>

                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <div
                                    className="dropdown-item"
                                    onClick={() => go("/contractors")}
                                >
                                    Firmy
                                </div>
                                <div
                                    className="dropdown-item"
                                    onClick={() => go("/contacts")}
                                >
                                    Osoby kontaktowe
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="nav-item" onClick={() => go("/settings")}>
                        <i className="fas fa-cog"></i> Ustawienia
                    </div>

                </div>

                <div
                    className="hamburger"
                    onClick={() => setMobileOpen(v => !v)}
                >
                    <i className="fas fa-bars"></i>
                </div>

                <button className="logout-btn" onClick={logout}>
                    <i className="fas fa-sign-out-alt"></i>
                </button>
            </nav>

            <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
                <div className="mobile-item" onClick={() => go("/panel")}>
                    Zlecenia
                </div>

                <div
                    className="mobile-item"
                    onClick={() => setMobileDropdownOpen(v => !v)}
                >
                    Klienci
                </div>

                {mobileDropdownOpen && (
                    <div className="mobile-submenu">
                        <div
                            className="mobile-subitem"
                            onClick={() => go("/contractors")}
                        >
                            Firmy
                        </div>
                        <div
                            className="mobile-subitem"
                            onClick={() => go("/contacts")}
                        >
                            Osoby kontaktowe
                        </div>
                    </div>
                )}

                <div className="mobile-item" onClick={() => go("/settings")}>Ustawienia</div>
            </div>
        </>
    );
}
