import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import LyraAvatar from '../components/LyraAvatar';

export default function Home() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "👋 Welcome to Invisible Insurance. I'm your assistant. What would you like to do today?" }
  ]);
  const [input, setInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUserInput = async () => {
    if (!input.trim()) return;
    const newUserMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setAiTyping(true);

    try {
      const response = await axios.post('/api/chat', {
        message: newUserMessage.text
      });
      const aiReply = response.data.reply;

      let i = 0;
      const typingInterval = setInterval(() => {
        if (i <= aiReply.length) {
          setMessages(prev => [...prev.slice(0, -1), { sender: 'ai', text: aiReply.slice(0, i) }]);
          i++;
        } else {
          clearInterval(typingInterval);
          setAiTyping(false);
        }
      }, 20);

      setMessages(prev => [...prev, { sender: 'ai', text: '' }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: "❌ I couldn't reach the AI. Please try again." }]);
      setAiTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800 flex flex-col items-center justify-center px-4">
      {/* LYRA Avatar Component */}
      <LyraAvatar />

      <h1 className="text-3xl font-bold mb-4 animate-fade-in mt-4">Invisible Insurance</h1>

      <div className="w-full max-w-xl bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-4 shadow-lg overflow-y-auto max-h-[70vh]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex items-start gap-2 animate-fade-in ${msg.sender === 'ai' ? '' : 'justify-end'}`}
          >
            <div className={`${msg.sender === 'ai' ? 'text-emerald-600' : 'text-sky-700'} bg-white px-3 py-2 rounded-xl shadow-sm max-w-[75%]`}>
              {msg.text}
            </div>
            {msg.sender === 'user' && <span className="text-xl">👤</span>}
          </div>
        ))}
        {aiTyping && (
          <div className="flex items-center gap-2 text-emerald-600 text-sm animate-pulse">
            <span className="italic">LYRA is thinking...</span>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <input
        className="mt-4 w-full max-w-xl px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded shadow-md focus:outline-blue-400 transition duration-200 hover:shadow-lg"
        type="text"
        placeholder="Type your message and press Enter..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
}
