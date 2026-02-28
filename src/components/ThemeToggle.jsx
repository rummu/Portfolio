"use client";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        setDark(document.documentElement.getAttribute("data-theme") === "dark");
    }, []);

    const toggle = () => {
        const newTheme = dark ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        setDark(!dark);
    };

    return (
        <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
            <i className={dark ? "fa-duotone fa-lightbulb-slash" : "fa-duotone fa-lightbulb"} />
        </button>
    );
}
