"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import LeftPanel from "@/components/LeftPanel";
import AboutMe from "@/components/sections/AboutMe";
import Experience from "@/components/sections/Experience";
import Publications from "@/components/sections/Publications";
import Projects from "@/components/sections/Projects";
import Responsibilities from "@/components/sections/Responsibilities";
import Awards from "@/components/sections/Awards";
import Certifications from "@/components/sections/Certifications";
import Booking from "@/components/sections/Booking";
import Chatbot from "@/components/Chatbot";
import ThemeToggle from "@/components/ThemeToggle";

const SECTIONS = {
  aboutme: AboutMe,
  experience: Experience,
  publications: Publications,
  projects: Projects,
  responsibilities: Responsibilities,
  awards: Awards,
  certifications: Certifications,
  booking: Booking,
};

export default function Home() {
  const [activeSection, setActiveSection] = useState("aboutme");
  const ActiveComponent = SECTIONS[activeSection];

  return (
    <>
      <Navbar active={activeSection} onChange={setActiveSection} />
      <div className="portfolio-layout">
        <LeftPanel />
        <main className="main-content">
          <ActiveComponent />
        </main>
      </div>
      <ThemeToggle />
      <Chatbot />
    </>
  );
}
