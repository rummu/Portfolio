export default function AboutMe() {
    return (
        <div>
            <p style={{ marginTop: 8, textAlign: "justify", lineHeight: 1.7 }}>
                I&apos;m currently pursuing a Masters in Computer Science at the University of Bonn, Germany. I completed my B.Tech in Computer Science and Engineering at Jamia Millia Islamia (2021-2025), graduating with a GPA of 8.65/10. My passion lies in AI, Machine Learning, and Computer Vision. I haven&apos;t just studied these topics; I&apos;ve applied them in real-world internships at Nikah Forever, Stepping Cloud, and Algoma University.
            </p>

            <h4 style={{ marginTop: 24 }}>News</h4>
            <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: 8 }}>
                {[
                    "Feb 2026: Received an offer for Masters in Computer Science from University of Bonn, Germany.",
                    "June 2025: Received an offer for Direct PhD from Case Western Reserve University, Ohio, USA.",
                    "Feb 2025: Honored with the prestigious Erasmus COSI Scholarship (2025–2027 Cohort).",
                    "Sep 2024: Elected as IEEE Student Chairman at Jamia Millia Islamia.",
                    "Aug 2024: Successfully completed MITACS Global Link Research Internship in Canada.",
                    "Jun 2024: Awarded the Fatima Predoctoral Fellowship.",
                ].map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                        <i className="fa fa-newspaper" style={{ marginTop: 4, color: "var(--t-secondary)" }} />
                        <span className="t-secondary">{item}</span>
                    </li>
                ))}
            </ul>

            <h4 style={{ marginTop: 24 }}>Education</h4>
            <div className="academic-block" style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 600 }}>Jamia Millia Islamia (2021 - 2025)</div>
                <div className="academic-rol">Bachelor of Technology in Computer Science and Engineering</div>
                <div className="academic-year">Grade: 8.65/10 (188 ECTS)</div>
                <p style={{ marginTop: 8, textAlign: "justify" }}>
                    Relevant Coursework: Data Structures and Algorithms, Object-Oriented Programming, Computer Networks, Operating Systems, DBMS, Software Engineering, Computer Vision, Compiler Design, Machine Learning, NLP, Deep Learning.
                </p>
            </div>

            <h4 style={{ marginTop: 24 }}>Skills</h4>
            <div style={{ marginTop: 8, lineHeight: 1.8 }}>
                <div><strong>Languages:</strong> Java, C/C++, Python</div>
                <div><strong>Data Science:</strong> Computer Vision, Deep Learning, Data Mining, Machine Learning, Image Segmentation, NLP, Statistics &amp; Statistical Modeling, Agentic AI, Transformer</div>
                <div><strong>Libraries:</strong> Python NLTK, REGEX, Matplotlib, Tensorflow, Keras, OpenCV, PyTorch, Numpy, Pandas, Scikit Learn, Langchain, Ollama</div>
                <div><strong>Frameworks:</strong> Python Flask, NodeJS, ReactJs, Django, NextJS</div>
                <div><strong>Dev Tools:</strong> GIT, Linux, Azure, AWS, Digital Ocean, Oracle, Jira</div>
                <div><strong>Databases:</strong> MySQL, MongoDB, PostgreSQL</div>
                <div><strong>Data Warehouse:</strong> Amazon Redshift, Snowflake</div>
            </div>

            <h4 style={{ marginTop: 24 }}>Hobbies</h4>
            <div className="academic-block" style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 600 }}>Sports &amp; Workout</div>
                <p style={{ marginTop: 6, textAlign: "justify" }}>As a sports and workout enthusiast, I believe in the importance of physical activity for a sharp mind. My father always told me that an active mind doesn&apos;t exist without an active body. This advice has driven me to stay engaged in various sports, particularly football (huge Cristiano Ronaldo fan), and maintain a consistent workout routine.</p>
            </div>
            <div className="academic-block" style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 600 }}>Anime</div>
                <p style={{ marginTop: 6 }}>I enjoy watching anime in my free time.</p>
            </div>
            <div className="academic-block" style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 600 }}>Travelling</div>
                <p style={{ marginTop: 6 }}>I love to travel and explore new places.</p>
                <div style={{ marginTop: 4 }}>
                    <strong>India:</strong> Manali, Nanital, Mussoorie, Kashmir, Sikkim, Kerala, Tamil Nadu, Rajasthan.<br />
                    <strong>Canada:</strong> Toronto, Niagara Falls, Sault Ste. Marie, Sudbury, London.
                </div>
            </div>
        </div>
    );
}
