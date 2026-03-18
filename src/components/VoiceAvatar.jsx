"use client";
import { useState, useRef, useEffect } from "react";

const CHATBOT_API = process.env.NEXT_PUBLIC_CHATBOT_API || "http://localhost:8000/api/chat";

export default function VoiceAvatar() {
    const [state, setState] = useState("idle"); // idle, listening, loading, speaking
    const [voiceMuted, setVoiceMuted] = useState(false);
    const [speakingGifIndex, setSpeakingGifIndex] = useState(0);
    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);
    const finalTranscriptRef = useRef("");

    const speakingGifs = [
        "/GIF avatar/metaperson_mix_2.gif",
        "/GIF avatar/metaperson_mix_4.gif",
        "/GIF avatar/metaperson_mix_5.gif" // Assuming mix 5 exists, or it will just gracefully fallback
    ];

    useEffect(() => {
        let gifInterval;
        if (state === "speaking") {
            gifInterval = setInterval(() => {
                setSpeakingGifIndex((prev) => (prev + 1) % speakingGifs.length);
            }, 600); // Swap GIF every 600ms
        } else {
            setSpeakingGifIndex(0);
        }
        return () => clearInterval(gifInterval);
    }, [state]);

    useEffect(() => {
        if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true; // Wait for user to stop completely
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = "en-US";

            recognitionRef.current.onresult = (event) => {
                // Clear the timeout every time new sound happens
                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscriptRef.current += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                // Wait 2 seconds of silence before officially sending the payload
                silenceTimerRef.current = setTimeout(() => {
                    if (finalTranscriptRef.current || interimTranscript) {
                        const fullText = (finalTranscriptRef.current + interimTranscript).trim();
                        if (fullText) {
                            recognitionRef.current?.stop();
                            setState("loading");
                            sendVoiceMessage(fullText);
                            finalTranscriptRef.current = ""; // Reset
                        }
                    }
                }, 2000);
            };

            recognitionRef.current.onerror = (event) => {
                if (event.error !== 'no-speech') {
                    console.error("Speech recognition error", event.error);
                }
                setState("idle");
            };

            recognitionRef.current.onend = () => {
                if (state === "listening") setState("idle");
            };
        }

        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        }
    }, [state]);

    const toggleListening = () => {
        if (state === "listening") {
            recognitionRef.current?.stop();
            setState("idle");
        } else {
            recognitionRef.current?.start();
            setState("listening");
        }
    };

    const stripHtml = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const formatBot = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/\*(.*?)\*/g, "$1")
            .replace(/^- (.*)/gm, "$1")
            .replace(/\n/g, " ");
    };

    const speak = (text) => {
        if (voiceMuted || typeof window === "undefined" || !("speechSynthesis" in window)) {
            setState("idle");
            return;
        }

        window.speechSynthesis.cancel();
        const plainText = stripHtml(formatBot(text));
        const utterance = new SpeechSynthesisUtterance(plainText);

        utterance.onstart = () => setState("speaking");
        utterance.onend = () => {
            // Go immediately back to listening so the user can reply
            setState("listening");
            try {
                recognitionRef.current?.start();
            } catch (e) {
                // Ignore if it's already started
            }
        };
        utterance.onerror = () => setState("idle");

        window.speechSynthesis.speak(utterance);
    };

    const sendVoiceMessage = async (text) => {
        if (!text) return;

        try {
            const res = await fetch(CHATBOT_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
            });
            const data = await res.json();
            const botResponse = data.answer || "Sorry, I could not generate a response.";
            speak(botResponse);
        } catch {
            speak("Sorry, I could not reach the server.");
        }
    };

    const cancelVoice = (e) => {
        e.stopPropagation(); // Prevent triggering the big avatar button underneath
        window.speechSynthesis.cancel();
        recognitionRef.current?.stop();
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        setState("idle");
    };

    return (
        <div className={`voice-avatar-container ${state}`}>
            {state !== "idle" && (
                <button
                    className="voice-minimize-btn"
                    onClick={cancelVoice}
                    title="Minimize Avatar"
                >
                    <i className="fa-solid fa-compress"></i>
                </button>
            )}

            <button
                className="voice-mute-toggle"
                onClick={() => {
                    setVoiceMuted(!voiceMuted);
                    if (!voiceMuted && state === "speaking") window.speechSynthesis.cancel();
                }}
                title={voiceMuted ? "Unmute Voice" : "Mute Voice"}
            >
                <i className={`fa-solid ${voiceMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`} />
            </button>

            <button
                className={`voice-avatar-btn ${state}`}
                onClick={toggleListening}
                title="Click to talk"
                disabled={state === "loading" || state === "speaking"}
            >
                <div className="voice-avatar-ring"></div>
                <div className="voice-avatar-img">
                    <img
                        src={
                            state === "listening" ? "/GIF avatar/metaperson_confused.gif" :
                                state === "loading" ? "/GIF avatar/metaperson_mix_3.gif" :
                                    state === "speaking" ? speakingGifs[speakingGifIndex] :
                                        "/GIF avatar/metaperson_glad.gif" // Idle state
                        }
                        alt="Animated Avatar"
                        width="60"
                        height="60"
                    />
                </div>
            </button>

            {state === "listening" && <div className="voice-status listening">Listening...</div>}
            {state === "loading" && <div className="voice-status loading">Thinking...</div>}
            {state === "speaking" && <div className="voice-status speaking">Speaking</div>}
        </div>
    );
}
