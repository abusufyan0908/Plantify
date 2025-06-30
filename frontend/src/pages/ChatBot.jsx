/* eslint-disable no-unused-vars */
import React from 'react';
import FinalChatbot from '../components/FinalChatbot'; 

const ChatBot = () => {
  return (
    <div>
      {/* Add margin-bottom to create space between the components */}
      <div className="mb-8">
        <FinalChatbot /> 
      </div>
      
      {/* Add margin-top to create space above GardenPlanner */}
      <div className="mt-8">
       
      </div>
      
    </div>
  );
};

export default ChatBot;
