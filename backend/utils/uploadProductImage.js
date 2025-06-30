// utils/uploadProductImage.js
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Set up multer for handling image uploads
const storage = multer.memoryStorage();  // Store image in memory temporarily
const upload = multer({ storage });

// Upload product image to Cloudinary
export const uploadProductImageToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.buffer, {
            folder: "plantify_products",  // Folder in Cloudinary
            resource_type: "auto"         // Auto-detect file type
        });

        return result;
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new Error("Error uploading product image to Cloudinary.");
    }
};

// Export the multer instance for use in routes
export { upload };
