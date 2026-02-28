export default function Awards() {
    return (
        <div>
            <h2 className="section-title">Honours and Awards</h2>
            {[
                { name: "Erasmus COSI Scholarship", period: "2025–2027 Cohort", desc: "Honored with the prestigious Erasmus COSI Scholarship." },
                { name: "MITACS Global Link Research Internship", period: "Algoma University (2024)", desc: "Acknowledged as a MITACS Global Link Research Internship 2024 Scholar." },
                { name: "Fatima Predoctoral Fellowship", period: "2024", desc: "Awarded the Fatima Predoctoral Fellowship 2024." },
                { name: "3rd Position - HackInit", period: "Jamia Millia Islamia (2023)", desc: "Secured 3rd position in HackInit hackathon organized by JMI." },
            ].map((a, i) => (
                <div key={i} className="academic-block" style={{ marginTop: 16 }}>
                    <div className="leadership-name">{a.name}</div>
                    <div className="academic-rol" style={{ marginTop: 4 }}>{a.period}</div>
                    <p style={{ marginTop: 6 }}>{a.desc}</p>
                </div>
            ))}
        </div>
    );
}
