import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Mic, User, Bot as BotIcon } from 'lucide-react';
import { getGeminiResponse } from '../services/aiService';
import ReactMarkdown from 'react-markdown';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Saathi, your government assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsgText = input;
    const userMsg = { id: Date.now(), text: userMsgText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(userMsgText);
      const botMsg = { 
        id: Date.now() + 1, 
        text: response, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chatbot Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
  };

  if (!isOpen) return null;

  return (
    <div className="glass-card fade-in" style={{ 
      position: 'fixed', 
      bottom: '90px', 
      right: '2rem', 
      width: '380px', 
      height: '500px', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: 0, 
      zIndex: 2000,
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      border: '1px solid var(--border)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ background: 'var(--accent)', color: 'white', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BotIcon size={24} />
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem' }}>Saathi AI</h4>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Online | Government Expert</span>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ 
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%',
            padding: '0.75rem 1rem',
            borderRadius: msg.sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
            background: msg.sender === 'user' ? 'var(--primary)' : 'white',
            color: msg.sender === 'user' ? 'white' : 'var(--accent)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            fontSize: '0.95rem',
            lineHeight: '1.4'
          }}>
            {msg.sender === 'bot' ? (
              <ReactMarkdown 
                components={{
                  p: ({node, ...props}) => <p style={{ margin: 0 }} {...props} />,
                  strong: ({node, ...props}) => <strong style={{ fontWeight: 800, color: 'var(--primary)' }} {...props} />
                }}
              >
                {msg.text}
              </ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        ))}
        {isLoading && (
          <div style={{ 
            alignSelf: 'flex-start',
            padding: '0.75rem 1rem',
            borderRadius: '18px 18px 18px 0',
            background: 'white',
            color: 'var(--accent)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            fontSize: '0.9rem',
            display: 'flex',
            gap: '4px'
          }}>
            <span className="typing-dot">.</span>
            <span className="typing-dot">.</span>
            <span className="typing-dot">.</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', background: 'white', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button 
          onClick={handleVoiceInput} 
          style={{ background: isListening ? '#fee2e2' : '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', color: isListening ? '#ef4444' : 'var(--text-muted)' }}
        >
          <Mic size={20} />
        </button>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Ask me anything..." 
          style={{ margin: 0, borderRadius: '24px', height: '42px', padding: '0 1.25rem' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend} 
          style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
