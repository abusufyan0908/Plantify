import Chat from '../models/chatModel.js';
import Gardener from '../models/gardenerModel.js';

// Get or create chat
const getOrCreateChat = async (req, res) => {
  try {
    const { gardenerId, userId } = req.body;

    // Check if gardener exists
    const gardener = await Gardener.findById(gardenerId);
    if (!gardener) {
      return res.status(404).json({
        success: false,
        message: 'Gardener not found'
      });
    }

    // Try to find existing chat
    let chat = await Chat.findOne({
      gardenerId,
      userId
    });

    // If chat doesn't exist, create a new one
    if (!chat) {
      chat = new Chat({
        gardenerId,
        userId,
        messages: []
      });
      await chat.save();

      // Update gardener's active chats
      await Gardener.findByIdAndUpdate(gardenerId, {
        $push: {
          activeChats: {
            userId,
            lastMessage: '',
            lastMessageTime: new Date(),
            unreadCount: 0
          }
        }
      });
    }

    res.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Error in getOrCreateChat:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong'
    });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, sender } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Add new message
    const newMessage = {
      sender,
      content,
      timestamp: new Date(),
      read: false
    };

    chat.messages.push(newMessage);
    chat.lastMessage = content;
    chat.lastMessageTime = new Date();

    // Update unread count if message is from user
    if (sender === 'user') {
      chat.unreadCount += 1;
    }

    await chat.save();

    // Update gardener's active chats
    await Gardener.findByIdAndUpdate(chat.gardenerId, {
      $set: {
        'activeChats.$[elem].lastMessage': content,
        'activeChats.$[elem].lastMessageTime': new Date(),
        'activeChats.$[elem].unreadCount': sender === 'user' ? 1 : 0
      }
    }, {
      arrayFilters: [{ 'elem.userId': chat.userId }]
    });

    res.json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong'
    });
  }
};

// Get chat messages
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const chat = await Chat.findById(chatId)
      .select('messages')
      .sort({ 'messages.timestamp': -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    res.json({
      success: true,
      messages: chat.messages.reverse()
    });
  } catch (error) {
    console.error('Error in getMessages:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong'
    });
  }
};

// Mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Mark all unread messages as read
    chat.messages.forEach(message => {
      if (message.sender !== 'user' && !message.read) {
        message.read = true;
      }
    });

    chat.unreadCount = 0;
    await chat.save();

    // Update gardener's active chats
    await Gardener.findByIdAndUpdate(chat.gardenerId, {
      $set: {
        'activeChats.$[elem].unreadCount': 0
      }
    }, {
      arrayFilters: [{ 'elem.userId': userId }]
    });

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error in markAsRead:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong'
    });
  }
};

// Get user's chats
const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({ userId })
      .populate('gardenerId', 'name faceImage')
      .sort({ lastMessageTime: -1 });

    res.json({
      success: true,
      chats
    });
  } catch (error) {
    console.error('Error in getUserChats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong'
    });
  }
};

export {
  getOrCreateChat,
  sendMessage,
  getMessages,
  markAsRead,
  getUserChats
}; 