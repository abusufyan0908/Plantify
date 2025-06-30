import mongoose from 'mongoose';

const gardenerProfileSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  minimumHours: {
    type: Number,
    required: true
  },
  certifications: [{
    type: String
  }],
  languages: [{
    type: String
  }],
  bio: {
    type: String,
    required: true
  },
  faceImage: {
    type: String
  },
  workImages: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const GardenerProfile = mongoose.model('GardenerProfile', gardenerProfileSchema);

export default GardenerProfile; 