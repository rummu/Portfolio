"use client";
import { useState, useRef, useEffect } from "react";

const CHATBOT_API = process.env.NEXT_PUBLIC_CHATBOT_API || "http://localhost:8000/api/chat";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: "bot", text: "👋 Hi there! I'm RummuAI, Rumman's personal AI. Ask me anything about his skills, experience, projects, or education!" },
    ]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const messagesRef = useRef(null);

    useEffect(() => {
        if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, [messages]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || sending) return;
        setSending(true);
        setInput("");
        setMessages((m) => [...m, { type: "user", text }]);

        try {
            const res = await fetch(CHATBOT_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
            });
            const data = await res.json();
            setMessages((m) => [...m, { type: "bot", text: data.answer || "Sorry, I could not generate a response." }]);
        } catch {
            setMessages((m) => [...m, { type: "bot", text: "⚠️ Could not reach the AI server. Please make sure the backend is running." }]);
        }
        setSending(false);
    };

    const formatBot = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .replace(/^- (.*)/gm, "• $1")
            .replace(/\n/g, "<br/>");
    };

    return (
        <>
            <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Open RummuAI">
                <i className={isOpen ? "fa-solid fa-xmark" : "fa-solid fa-robot"} />
            </button>

            <div className={`chatbot-panel${isOpen ? " open" : ""}`}>
                <div className="chatbot-header">
                    <div className="chatbot-header-avatar">🤖</div>
                    <div className="chatbot-header-info">
                        <h4>RummuAI</h4>
                        <p>Powered by RAG + Gemini</p>
                    </div>
                </div>

                <div className="chatbot-messages" ref={messagesRef}>
                    {messages.map((m, i) => (
                        <div key={i} className={`chatbot-msg ${m.type}`}>
                            {m.type === "bot" ? (
                                <span dangerouslySetInnerHTML={{ __html: formatBot(m.text) }} />
                            ) : (
                                m.text
                            )}
                        </div>
                    ))}
                    {sending && (
                        <div className="chatbot-typing"><span /><span /><span /></div>
                    )}
                </div>

                <div className="chatbot-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                        placeholder="Ask about Rumman..."
                        autoComplete="off"
                    />
                    <button onClick={sendMessage} disabled={sending} aria-label="Send message">
                        <i className="fa-solid fa-paper-plane" />
                    </button>
                </div>

                <div className="chatbot-footer">⚡ RAG + FAISS + Google Gemini</div>
            </div>
        </>
    );
}
