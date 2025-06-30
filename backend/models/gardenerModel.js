import mongoose from "mongoose";

const gardenerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  faceImage: {
    type: String,  // URL of the image stored on Cloudinary
    required: false,
    default: null
  },
  workImages: {
    type: [String], // Array of image URLs stored on Cloudinary
    required: false,
    default: []
  },
  workHistory: {
    type: [String], // Array of work history items
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  // New fields for chat and availability
  isAvailable: {
    type: Boolean,
    default: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  minimumHours: {
    type: Number,
    required: true,
    default: 2,
  },
  specialties: {
    type: [String],
    required: false,
    default: [],
  },
  certifications: {
    type: [String],
    required: false,
    default: [],
  },
  languages: {
    type: [String],
    required: false,
    default: [],
  },
  // Chat related fields
  activeChats: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
    unreadCount: {
      type: Number,
      default: 0,
    }
  }],
  // Additional profile information
  portfolio: {
    type: [{
      title: String,
      description: String,
      image: String,
      date: Date
    }],
    default: []
  },
  contactInfo: {
    whatsapp: String,
    instagram: String,
    facebook: String,
    website: String
  }
}, { timestamps: true });

const Gardener = mongoose.model("Gardener", gardenerSchema);

export default Gardener;
