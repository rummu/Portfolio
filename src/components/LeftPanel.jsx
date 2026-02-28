import Image from "next/image";

export default function LeftPanel() {
    return (
        <aside className="left-panel">
            <Image src="/passport.png" alt="Rumman Ahmad" width={280} height={280} className="profile-picture" priority />
            <h3>Rumman Ahmad</h3>
            <p className="bio">Masters in Computer Science at University of Bonn, Germany</p>

            <div className="contact-row"><i className="fal fa-map-marker-alt" /><span>Fa-34, Jamia Nagar, New Delhi, India</span></div>
            <div className="contact-row"><i className="ai ai-cv" /><a href="https://drive.google.com/file/d/1go7DSPi4ClBsBp_crMfOyRdC3VYNBGqS/view?usp=sharing" target="_blank">CV [Updated 02/2026]</a></div>
            <div className="contact-row"><i className="fa-regular fa-envelope" /><a href="mailto:rummanahmad05@gmail.com">rummanahmad05@gmail.com</a></div>
            <div className="contact-row"><i className="fa-brands fa-phone" /><a href="tel:+917982364612">(+91) 7982364612</a></div>
            <div className="contact-row"><i className="fa-brands fa-linkedin" /><a href="https://www.linkedin.com/in/rumman-ahmad-205255210/" target="_blank">LinkedIn</a></div>
            <div className="contact-row"><i className="fab fa-github" /><a href="https://github.com/rummu" target="_blank">GitHub</a></div>
            <div className="contact-row"><i className="ai ai-google-scholar" /><a href="https://scholar.google.com/citations?user=ciJwylQAAAAJ&hl=en" target="_blank">Google Scholar</a></div>
            <div className="contact-row"><i className="fab fa-kaggle" /><a href="https://www.kaggle.com/rummanahmad05" target="_blank">Kaggle</a></div>
        </aside>
    );
}
