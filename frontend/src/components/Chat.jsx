import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FaPaperPlane, FaArrowLeft } from 'react-icons/fa';

// Sample data structure for chats
const initialChats = {
  1: {
    messages: [],
    hasHireRequest: false
  },
  2: {
    messages: [],
    hasHireRequest: false
  },
  3: {
    messages: [],
    hasHireRequest: false
  }
};

const Chat = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem('gardenerChats');
    return savedChats ? JSON.parse(savedChats) : initialChats;
  });
  const messagesEndRef = useRef(null);
  const isHireRequest = searchParams.get('type') === 'hire';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Load existing chat or create new one
    if (!chats[id]) {
      setChats(prev => ({
        ...prev,
        [id]: {
          messages: [],
          hasHireRequest: false
        }
      }));
    }

    // If this is a hire request and we haven't sent one before
    if (isHireRequest && !chats[id]?.hasHireRequest) {
      const hireMessage = {
        id: Date.now(),
        sender: 'user',
        text: "Hi! I'm interested in hiring you for my gardening needs. Could we discuss the details?",
        timestamp: new Date().toISOString()
      };
      
      const updatedChats = {
        ...chats,
        [id]: {
          messages: [...(chats[id]?.messages || []), hireMessage],
          hasHireRequest: true
        }
      };
      
      setChats(updatedChats);
      localStorage.setItem('gardenerChats', JSON.stringify(updatedChats));
    }

    setMessages(chats[id]?.messages || []);
  }, [id, isHireRequest]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);

    const updatedChats = {
      ...chats,
      [id]: {
        messages: updatedMessages,
        hasHireRequest: chats[id]?.hasHireRequest || false
      }
    };

    setChats(updatedChats);
    localStorage.setItem('gardenerChats', JSON.stringify(updatedChats));
    setNewMessage('');

    // Simulate gardener response
    setTimeout(() => {
      const response = {
        id: Date.now() + 1,
        sender: 'gardener',
        text: "Thank you for your message. I'll get back to you shortly!",
        timestamp: new Date().toISOString()
      };

      const updatedWithResponse = [...updatedMessages, response];
      setMessages(updatedWithResponse);

      const chatsWithResponse = {
        ...updatedChats,
        [id]: {
          messages: updatedWithResponse,
          hasHireRequest: chats[id]?.hasHireRequest || false
        }
      };

      setChats(chatsWithResponse);
      localStorage.setItem('gardenerChats', JSON.stringify(chatsWithResponse));
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="bg-emerald-600 p-4 flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-emerald-100 transition-colors"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-white">Chat with Gardener</h2>
            {chats[id]?.hasHireRequest && (
              <p className="text-emerald-100 text-sm">Hire Request Active</p>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="h-[60vh] overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl p-4 ${
                  message.sender === 'user'
                    ? 'bg-emerald-600 text-white ml-4'
                    : 'bg-gray-100 text-gray-800 mr-4'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat; 