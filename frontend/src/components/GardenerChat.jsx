import React, { useState, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const GardenerChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // TODO: Fetch active chats from backend
    // Mock data for now
    setChats([
      {
        userId: '1',
        userName: 'Alice Smith',
        lastMessage: 'Hi, I need help with my garden',
        lastMessageTime: '2024-01-20T10:30:00',
        unreadCount: 2
      },
      // Add more mock chats
    ]);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // TODO: Implement sending message to backend
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* Chat list */}
          <div className="border-r">
            <div className="p-4 bg-emerald-600">
              <h2 className="text-xl font-bold text-white">Messages</h2>
            </div>
            <div className="overflow-y-auto h-[calc(600px-4rem)]">
              {chats.map((chat) => (
                <div
                  key={chat.userId}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedChat?.userId === chat.userId ? 'bg-emerald-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{chat.userName}</h3>
                    <span className="text-xs text-gray-500">
                      {new Date(chat.lastMessageTime).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{chat.lastMessage}</p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat messages */}
          <div className="col-span-2 flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 bg-emerald-600">
                  <h2 className="text-xl font-bold text-white">
                    {selectedChat.userName}
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {/* Messages will go here */}
                </div>
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Type your message..."
                    />
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                    >
                      <FaPaperPlane />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a chat to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenerChat;