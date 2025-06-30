import GardenerProfile from '../models/GardenerProfile.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getGardenerProfile = async (req, res) => {
  try {
    const gardener = await GardenerProfile.findOne({ email: req.user.email });
    if (!gardener) {
      return res.status(404).json({ message: 'No gardener profile found' });
    }
    res.json(gardener);
  } catch (error) {
    console.error('Error fetching gardener profile:', error);
    res.status(500).json({ message: 'Error fetching gardener profile' });
  }
};

export const updateGardenerProfile = async (req, res) => {
  try {
    const gardener = await GardenerProfile.findOne({ email: req.user.email });
    if (!gardener) {
      return res.status(404).json({ message: 'No gardener profile found' });
    }

    // Handle file uploads
    if (req.files) {
      if (req.files.faceImage) {
        const faceImageResult = await uploadToCloudinary(req.files.faceImage[0]);
        gardener.faceImage = faceImageResult.secure_url;
      }

      if (req.files.workImages) {
        const workImagesResults = await Promise.all(
          req.files.workImages.map(file => uploadToCloudinary(file))
        );
        gardener.workImages = workImagesResults.map(result => result.secure_url);
      }
    }

    // Update other fields
    const updateFields = [
      'email', 'phone', 'location', 'experience', 
      'hourlyRate', 'minimumHours', 'bio'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        gardener[field] = req.body[field];
      }
    });

    // Handle arrays (certifications and languages)
    if (req.body.certifications) {
      gardener.certifications = req.body.certifications.split(',').map(item => item.trim());
    }
    if (req.body.languages) {
      gardener.languages = req.body.languages.split(',').map(item => item.trim());
    }

    await gardener.save();
    res.json(gardener);
  } catch (error) {
    console.error('Error updating gardener profile:', error);
    res.status(500).json({ message: 'Error updating gardener profile' });
  }
}; 