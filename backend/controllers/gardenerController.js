import { v2 as cloudinary } from 'cloudinary';
import Gardener from '../models/gardenerModel.js';
import Chat from '../models/chatModel.js';
import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

// Helper function to upload a single image (face image) to Cloudinary
const uploadFaceImageToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path);
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return null;
  }
};

// Helper function to upload multiple images (work images) to Cloudinary
const uploadWorkImagesToCloudinary = async (files) => {
  try {
    const imageUrls = [];
    for (let file of files) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrls.push(result.secure_url);
    }
    return imageUrls;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return [];
  }
};

// Create gardener
const addGardener = async (req, res) => {
  try {
    const { 
      name, 
      location, 
      email, 
      phone, 
      bio, 
      experience, 
      workHistory,
      hourlyRate,
      minimumHours,
      specialties,
      certifications,
      languages,
      contactInfo
    } = req.body;

    // Validate required fields
    if (!name || !location || !email || !phone || !bio || !experience || !hourlyRate || !minimumHours) {
      return res.status(400).json({ 
        success: false, 
        message: "All required fields must be provided" 
      });
    }

    // Create gardener object
    const gardenerData = {
      name,
      location,
      email,
      phone,
      bio,
      experience,
      workHistory: Array.isArray(workHistory) ? workHistory : [],
      hourlyRate: parseFloat(hourlyRate),
      minimumHours: parseInt(minimumHours),
      specialties: Array.isArray(specialties) ? specialties : [],
      certifications: Array.isArray(certifications) ? certifications : [],
      languages: Array.isArray(languages) ? languages : [],
      contactInfo: contactInfo || {},
      isAvailable: true
    };
    gardenerData.userId = req.user.userId;

    // Handle image uploads
    if (req.files?.faceImage?.[0]) {
      const faceImageUrl = await uploadFaceImageToCloudinary(req.files.faceImage[0]);
      if (faceImageUrl) {
        gardenerData.faceImage = faceImageUrl;
      }
    }

    if (req.files?.workImages) {
      const workImageUrls = await uploadWorkImagesToCloudinary(req.files.workImages);
      if (workImageUrls.length > 0) {
        gardenerData.workImages = workImageUrls;
      }
    }

    const gardener = new Gardener(gardenerData);
    await gardener.save();

    res.status(201).json({
      success: true,
      message: 'Gardener added successfully',
      gardener
    });
  } catch (error) {
    console.error('Error in addGardener:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Something went wrong'
    });
  }
};

// Update gardener
const updateGardener = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Handle image uploads
    if (req.files?.faceImage?.[0]) {
      const faceImageUrl = await uploadFaceImageToCloudinary(req.files.faceImage[0]);
      if (faceImageUrl) {
        updates.faceImage = faceImageUrl;
      }
    }

    if (req.files?.workImages) {
      const workImageUrls = await uploadWorkImagesToCloudinary(req.files.workImages);
      if (workImageUrls.length > 0) {
        updates.workImages = workImageUrls;
      }
    }

    // Handle array fields
    if (updates.workHistory) {
      updates.workHistory = Array.isArray(updates.workHistory) ? updates.workHistory : [];
    }
    if (updates.specialties) {
      updates.specialties = Array.isArray(updates.specialties) ? updates.specialties : [];
    }
    if (updates.certifications) {
      updates.certifications = Array.isArray(updates.certifications) ? updates.certifications : [];
    }
    if (updates.languages) {
      updates.languages = Array.isArray(updates.languages) ? updates.languages : [];
    }

    const gardener = await Gardener.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!gardener) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gardener not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Gardener updated successfully',
      gardener 
    });
  } catch (error) {
    console.error('Error in updateGardener:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Something went wrong' 
    });
  }
};

// Get gardener by ID
const getGardener = async (req, res) => {
  try {
    const { id } = req.params;
    const gardener = await Gardener.findById(id);

    if (!gardener) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gardener not found' 
      });
    }

    res.json({ 
      success: true, 
      gardener 
    });
  } catch (error) {
    console.error('Error in getGardener:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Something went wrong' 
    });
  }
};

// List all gardeners
const listGardeners = async (req, res) => {
  try {
    const { 
      available, 
      minRating, 
      maxRate, 
      specialties,
      location 
    } = req.query;

    let query = {};

    if (available === 'true') {
      query.isAvailable = true;
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (maxRate) {
      query.hourlyRate = { $lte: parseFloat(maxRate) };
    }

    if (specialties) {
      query.specialties = { $in: specialties.split(',') };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const gardeners = await Gardener.find(query);

    res.json({ 
      success: true, 
      count: gardeners.length,
      gardeners 
    });
  } catch (error) {
    console.error('Error in listGardeners:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Something went wrong' 
    });
  }
};

// Update gardener availability
const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    const gardener = await Gardener.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    );

    if (!gardener) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gardener not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Availability updated successfully',
      gardener 
    });
  } catch (error) {
    console.error('Error in updateAvailability:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Something went wrong' 
    });
  }
};

// Add chat to gardener's active chats
const addChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const gardener = await Gardener.findById(id);
    if (!gardener) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gardener not found' 
      });
    }

    // Check if chat already exists
    const existingChat = gardener.activeChats.find(chat => chat.userId.toString() === userId);
    if (existingChat) {
      return res.json({ 
        success: true, 
        message: 'Chat already exists',
        chat: existingChat 
      });
    }

    // Add new chat
    gardener.activeChats.push({
      userId,
      lastMessage: '',
      lastMessageTime: new Date(),
      unreadCount: 0
    });

    await gardener.save();

    res.json({ 
      success: true, 
      message: 'Chat added successfully',
      chat: gardener.activeChats[gardener.activeChats.length - 1] 
    });
  } catch (error) {
    console.error('Error in addChat:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Something went wrong' 
    });
  }
};

// Get gardener profile
const getGardenerProfile = asyncHandler(async (req, res) => {
  try {
    console.log('req.user:', req.user); // Debug log
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No user info in token'
      });
    }
    const gardener = await Gardener.findOne({ userId: req.user.userId });
    if (!gardener) {
      return res.status(404).json({
        success: false,
        message: 'No gardener profile found'
      });
    }
    res.status(200).json({
      success: true,
      data: gardener
    });
  } catch (error) {
    console.error('Error fetching gardener profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gardener profile',
      error: error.message
    });
  }
});

// Update gardener profile
const updateGardenerProfile = asyncHandler(async (req, res) => {
  const {
    name,
    location,
    phone,
    bio,
    experience,
    hourlyRate,
    minimumHours,
    specialties,
    certifications,
    languages,
    contactInfo
  } = req.body;

  const gardener = await Gardener.findOne({ userId: req.user.userId });

  if (!gardener) {
    res.status(404);
    throw new Error('Gardener profile not found');
  }

  gardener.name = name || gardener.name;
  gardener.location = location || gardener.location;
  gardener.phone = phone || gardener.phone;
  gardener.bio = bio || gardener.bio;
  gardener.experience = experience || gardener.experience;
  gardener.hourlyRate = hourlyRate || gardener.hourlyRate;
  gardener.minimumHours = minimumHours || gardener.minimumHours;
  gardener.specialties = specialties || gardener.specialties;
  gardener.certifications = certifications || gardener.certifications;
  gardener.languages = languages || gardener.languages;
  gardener.contactInfo = contactInfo || gardener.contactInfo;

  const updatedGardener = await gardener.save();
  res.json(updatedGardener);
});

// Get all chats for gardener
const getGardenerChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ gardenerId: req.user._id })
    .populate('userId', 'username email')
    .sort({ lastMessageTime: -1 });

  res.json(chats);
});

// Get messages for a specific chat
const getChatMessages = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({
    _id: req.params.chatId,
    gardenerId: req.user._id
  }).populate('userId', 'username email');

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  res.json(chat);
});

// Send a message in a chat
const sendMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const chat = await Chat.findOne({
    _id: req.params.chatId,
    gardenerId: req.user._id
  });

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  chat.messages.push({
    sender: 'gardener',
    content,
    timestamp: new Date()
  });

  chat.lastMessage = content;
  chat.lastMessageTime = new Date();
  chat.unreadCount = 0;

  const updatedChat = await chat.save();
  res.json(updatedChat);
});

// Mark messages as read
const markMessagesAsRead = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({
    _id: req.params.chatId,
    gardenerId: req.user._id
  });

  if (!chat) {
    res.status(404);
    throw new Error('Chat not found');
  }

  chat.messages.forEach(message => {
    if (message.sender === 'user') {
      message.read = true;
    }
  });

  chat.unreadCount = 0;
  const updatedChat = await chat.save();
  res.json(updatedChat);
});

// Delete gardener
const deleteGardener = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const gardener = await Gardener.findById(id);

  if (!gardener) {
    res.status(404);
    throw new Error('Gardener not found');
  }

  await gardener.deleteOne();

  res.json({ message: 'Gardener removed' });
});

export {
  addGardener,
  listGardeners,
  getGardener,
  updateGardener,
  updateAvailability,
  addChat,
  getGardenerProfile,
  updateGardenerProfile,
  getGardenerChats,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  deleteGardener
};
