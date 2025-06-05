import React, { useState, useEffect, useRef } from "react";
import { get } from 'aws-amplify/api';

const VC = () => {
  // 1. State and refs
  const [messages, setMessages] = useState([]);
  const [transcriptText, setTranscriptText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const chatBoxRef = useRef(null);

  // 2. Event handler function: start voice recognition on button click
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    console.log(recognition,"hereeeee");

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = async (event) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join("");
      setTranscriptText(transcript);
      console.log(event,"i am here")
      if (event.results[0].isFinal) {
        setMessages(prev => [{ type: "user", text: transcript }, ...prev]);
        const botReply = await fetchBotReply(transcript);
        setMessages(prev => [{ type: "bot", text: botReply }, ...prev]);
        setTranscriptText(""); //reset transcript
      }
    };

    recognition.onerror = (e) => {
      console.error("Speech Error:", e.error);
      setIsListening(false);
    };

    recognition.start();
  };

  // 3. Helper async function: fetch bot reply from backend API
  const fetchBotReply = async (text) => {
    try {
      const restOperation = get({
        apiName: 'CHATAPI',
        path: '/items',
        options: { queryParams: { input: text.toLowerCase() } }
      });
      const { body } = await restOperation.response;
      const json = await body.json();
      return json.message;
    } catch (e) {
      console.error("Error fetching bot reply", e);
      return "Something went wrong.";
    }
  };

  // 4. Effect: scroll chat to top (newest message) when messages update
  useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = 0;
  }, [messages]);

  // 5. Styles and JSX render
  const styles = {
    container: {
      height: "100vh", width: "100vw", background: "#fff",
      display: "flex", flexDirection: "row", justifyContent: "space-between",
      alignItems: "center", fontFamily: "'Orbitron', sans-serif",
      overflow: "hidden", padding: "40px", boxSizing: "border-box",
    },
    chatSection: {
      flex: 2, background: "#f1f8fb", height: "80vh", borderRadius: "50px",
      padding: "30px", display: "flex", flexDirection: "column",
      justifyContent: "space-between", boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
    },
    chatBox: {
      flex: 1, overflowY: "scroll", display: "flex", flexDirection: "column-reverse",
      gap: "15px", marginBottom: "20px", scrollbarWidth: "none", msOverflowStyle: "none",
    },
    msg: {
      padding: "10px 20px", maxWidth: "60%", borderRadius: "20px", fontSize: "16px",
    },
    userMsg: { backgroundColor: "#e1e1e1", alignSelf: "flex-end" },
    botMsg: { backgroundColor: "#cfe8ff", alignSelf: "flex-start" },
    controls: { display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" },
    micButton: {
      width: "80px", height: "80px", background: isListening ? "#009d50" : "black",
      border: "none", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center",
      transition: "background 0.3s ease, transform 0.2s ease",
      animation: isListening ? "pulse 1.2s infinite" : "none",
    },
    transcript: {
      background: "#f1f8fb", padding: "10px 20px", borderRadius: "20px", fontSize: "14px",
      color: "#333", minWidth: "180px", textAlign: "center",
    },
    heading: {
      flex: 1, fontSize: "40px", fontWeight: "800", textAlign: "center",
      color: "#222", letterSpacing: "2px",
    },
    hideScrollbar: `.chatBox::-webkit-scrollbar { display: none; }`,
    pulseKeyframes: `@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }`,
  };

  return (
    <>
      <style>{styles.pulseKeyframes + styles.hideScrollbar}</style>
      <div style={styles.container}>
        <div style={styles.chatSection}>
          <div className="chatBox" style={styles.chatBox} ref={chatBoxRef}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.msg,
                  ...(msg.type === "user" ? styles.userMsg : styles.botMsg),
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div style={styles.controls}>
            <button
              onClick={startListening}
              style={styles.micButton}
              onMouseOver={(e) => (e.currentTarget.style.background = "#0056d2")}
              onMouseOut={(e) => (e.currentTarget.style.background = isListening ? "#009d50" : "black")}
              aria-label="Start Voice"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="28" height="28">
                <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3z" />
                <path d="M19 10v1a7 7 0 0 1-14 0v-1h2v1a5 5 0 0 0 10 0v-1h2z" />
                <path d="M12 17v4h-1v-4h1z" />
              </svg>
            </button>
            {transcriptText && <div style={styles.transcript}>{transcriptText}</div>}
          </div>
        </div>
        <div style={styles.heading}>KEEP IT VOICE AI</div>
      </div>
    </>
  );
};

export default VC;
