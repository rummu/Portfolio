const PROJECTS = [
    { title: "📱 MobileSR with Transformers", url: "https://www.kaggle.com/code/rummanahmad05/new-generation", lang: "Python", desc: "Developed Mobile Super-Resolution model combining convolutional layers with transformer-based architectures (GPT-2). Improved convergence with Cosine Annealing. Ensured high-fidelity restoration (SSIM/PSNR).", tags: [["Transformers", "t-sky"], ["GPT-2", "t-lime"], ["Super-Resolution", "t-purple"]] },
    { title: "🎵 Facial Recognition Music Rec", url: "https://github.com/rummu/Facial-Recognition-Based-Music-Recommendation-Application", lang: "Python", desc: "Built AI system detecting user emotions from facial expressions (~90% accuracy). Mapped emotions to curated playlists. Integrated with Spotify.", tags: [["ComputerVision", "t-purple"], ["Music", "t-sky"]] },
    { title: "🤖 RAG-based Intelligent Chatbot", url: "https://www.kaggle.com/code/rummanahmad05/llm-q-a", lang: "OpenAI API", desc: "Built Python-based system leveraging OpenAI GPT models. Designed RAG framework to enhance responses with external knowledge. Secure API/Auth integration.", tags: [["RAG", "t-orange"], ["LangChain", "t-blue"], ["LLM", "t-green"]] },
    { title: "🏏 Automated Cricket Commentary Generator", url: "https://www.kaggle.com/code/rummanahmad05/automated-cricket-commentary", lang: "Python", desc: "Developed a system to generate automated text commentary for cricket videos. Utilized VGG16 for visual features and LSTM for sequential commentary text.", tags: [["Deep Learning", "t-purple"], ["Computer Vision", "t-blue"], ["NLP", "t-orange"]] },
    { title: "🌿 Plant Village Disease Classification", url: "https://www.kaggle.com/code/rummanahmad05/plant-village-disease-classification-acc-99-6", lang: "Python", desc: "Achieved 99.6% accuracy fine-tuning EfficientNetB3 on PlantVillage dataset. Custom callback system for adaptive LR scheduling and early stopping.", tags: [["Deep Learning", "t-purple"], ["Transfer Learning", "t-blue"], ["Computer Vision", "t-green"]] },
    { title: "🚗 Drowsiness Detection System", url: "https://www.kaggle.com/code/rummanahmad05/yolov9-drowsiness-detection", lang: "Python", desc: "Developed driver drowsiness detection using YOLOv9 (GELAN-C). Trained for 200 epochs achieving ~0.76 mAP50 for real-time classification.", tags: [["Deep Learning", "t-purple"], ["Computer Vision", "t-blue"], ["YOLOv9", "t-green"]] },
    { title: "🚁 UAV-Based Disaster Detection", url: "https://github.com/rummu/UAV-Based-Disaster-Detection-", lang: "Python", desc: "Using UAVs for real-time monitoring in disaster-affected areas. Customized CNN with feature concatenation for disaster categorization.", tags: [["Deep Learning", "t-purple"], ["Computer Vision", "t-blue"], ["UAV", "t-green"]] },
    { title: "👕 HR-VITON Virtual Try-On", url: "https://www.kaggle.com/code/rummanahmad05/hr-viton-try-on-clothes", lang: "Python", desc: "Implemented HR-VITON using PyTorch and torchgeometry. Pairs user images with clothing, handles occlusions, generates realistic try-on results.", tags: [["Deep Learning", "t-purple"], ["Computer Vision", "t-blue"], ["HR-VITON", "t-green"]] },
];

export default function Projects() {
    return (
        <div>
            <h2 className="section-title">Projects</h2>
            {PROJECTS.map((p, i) => (
                <div key={i} className="project-card" onClick={() => window.open(p.url, "_blank")}>
                    <h5>{p.title}</h5>
                    <div style={{ fontSize: "0.85em", color: "var(--t-secondary)" }}>
                        <i className="fa-brands fa-python" /> {p.lang}
                    </div>
                    <p style={{ marginTop: 8, color: "var(--blog-short)", fontSize: "0.95em", lineHeight: 1.6 }}>{p.desc}</p>
                    <div className="project-tags">
                        {p.tags.map(([label, cls], j) => <span key={j} className={`tag ${cls}`}>{label}</span>)}
                    </div>
                </div>
            ))}
        </div>
    );
}
