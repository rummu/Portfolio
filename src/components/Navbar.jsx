"use client";
import { useState } from "react";

const NAV_ITEMS = [
    { id: "aboutme", label: "About Me" },
    { id: "experience", label: "Experience" },
    { id: "publications", label: "Publications" },
    { id: "projects", label: "Projects" },
    { id: "responsibilities", label: "Responsibilities" },
    { id: "awards", label: "Awards" },
    { id: "certifications", label: "Certifications" },
    { id: "booking", label: "Book a Slot" },
];

export default function Navbar({ active, onChange }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    <i className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"} />
                </button>
                <div className={`navbar-links${menuOpen ? " open" : ""}`}>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            className={`nav-link${active === item.id ? " active" : ""}`}
                            onClick={() => { onChange(item.id); setMenuOpen(false); }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
