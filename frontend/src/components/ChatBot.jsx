import { useState, useEffect, useRef } from "react";
import { api } from "../api/client";
import "./ChatBot.css";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! What are you learning today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await api.post("/chat", { messages: newMessages });
      if (response.data && response.data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I encountered an error." },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't reach the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      {/* Widget Bubble */}
      {!isOpen && (
        <button
          className="chatbot-bubble"
          onClick={toggleChat}
          aria-label="Open Chatbot"
        >
          {/* Chat Icon - simple SVG */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 11.5C21 16.1944 16.9706 20 12 20C10.5986 20 9.2713 19.6385 8.09653 19.0063C7.54019 18.7067 6.89063 18.6653 6.3013 18.8893L3.89674 19.8033C3.25055 20.0489 2.61053 19.4089 2.85608 18.7627L3.77011 16.3582C3.99407 15.7688 3.95272 15.1193 3.65313 14.5629C3.02086 13.3882 2.65934 12.0609 2.65934 10.6595C2.65934 5.96515 6.68878 2.15955 11.6593 2.15955C16.6299 2.15955 20.6593 5.96515 20.6593 10.6595Z" fill="currentColor"/>
          </svg>
        </button>
      )}

      {/* Chat Window */}
      <div className={`chatbot-window`}>
        <div className="chatbot-header">
          <h3>Tutor AI</h3>
          <button className="chatbot-close" onClick={toggleChat} aria-label="Close Chat">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-msg ${msg.role}`}>
              <div className="msg-bubble">{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div className="chatbot-msg assistant">
              <div className="msg-bubble loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input-form" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
          />
          <button type="submit" disabled={!input.trim() || loading} aria-label="Send">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
