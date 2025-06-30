import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import PropTypes from "prop-types";
import { companyInfo } from '../companyInfo';

const Chatbot = () => {
  const chatBodyRef = useRef();
  const inputRef = useRef();
  const [chatHistory, setChatHistory] = useState([
    { hideInChat: true, role: "model", text: companyInfo }, // Initial message with company info
    { role: "model", text: "Hi there! How can I assist you today?" }, // Bot's greeting
  ]);

  const ChatMessage = ({ chat }) => {
    return (
      !chat.hideInChat && (
        <div
          className={`message flex items-start space-x-3 p-4 mb-4 rounded-2xl max-w-[85%] w-full shadow-sm
            ${chat.role === "model" 
              ? "bg-white text-gray-800 border border-gray-100 ml-4" 
              : "bg-emerald-50 text-gray-800 mr-4 ml-auto"} 
            ${chat.isError ? "bg-red-50 text-red-600 border-red-100" : ""}`}
        >
          <div className={`text-xs font-medium flex-shrink-0
            ${chat.role === "model" ? "text-gray-500" : "text-emerald-600"}`}>
            {chat.role === "model" ? "Bot" : "You"}
          </div>
          <p className={`message-text text-sm leading-relaxed ${chat.isError ? "font-semibold" : ""}`}>
            {chat.text}
          </p>
        </div>
      )
    );
  };

  ChatMessage.propTypes = {
    chat: PropTypes.shape({
      hideInChat: PropTypes.bool.isRequired,
      role: PropTypes.string.isRequired,
      isError: PropTypes.bool,
      text: PropTypes.string.isRequired
    }).isRequired
  };


  const ChatForm = () => {
    const handleFormSubmit = (e) => {
      e.preventDefault();
      const userMessage = inputRef.current.value.trim();
      if (!userMessage) return;
      inputRef.current.value = "";

      setChatHistory((history) => [...history, { role: "user", text: userMessage }]);

      setTimeout(() => {
        setChatHistory((history) => [...history, { role: "model", text: "Thinking..." }]);

        generateBotResponse([
          ...chatHistory,
          { role: "user", text: `Using the details provided above, please address this query: ${userMessage}` },
        ]);
      }, 600);
    };

    return (
      <form onSubmit={handleFormSubmit} className="chat-form flex items-center space-x-4 p-4">
        <input
          ref={inputRef}
          placeholder="Type your message here..."
          className="message-input w-full p-4 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all duration-200"
          required
        />
        <button
          type="submit"
          id="send-message"
          className="bg-emerald-500 p-3 text-white rounded-full cursor-pointer transition-all duration-200 hover:bg-emerald-600 hover:scale-105 active:scale-95 shadow-md"
        >
          <FiSend className="w-5 h-5" />
        </button>
      </form>
    );
  };


  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };

    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error.message || "Something went wrong!");
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" }); // Optional chaining
  }, [chatHistory]);

  return (
    <div className="chatbot-container flex justify-center items-start pt-8 px-4 min-h-screen bg-gray-50">
      <div className="chatbot-window w-full sm:w-[90%] md:w-[80%] lg:w-[90%] xl:w-[80%] h-[60vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] xl:h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        <div className="chat-header flex justify-between items-center p-6 bg-white border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              🌱
            </div>
            <h2 className="font-bold text-xl text-gray-800">Plantify Chatbot</h2>
          </div>
        </div>

        <div ref={chatBodyRef} className="chat-body flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-footer bg-white border-t border-gray-100">
          <ChatForm />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;