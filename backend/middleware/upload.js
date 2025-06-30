import multer from 'multer';

// Set up the storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the directory where the files will be saved
    cb(null, 'uploads/'); // Make sure the 'uploads' folder exists or create it
  },
  filename: (req, file, cb) => {
    // Define the filename format
    cb(null, Date.now() + '-' + file.originalname); // Adds timestamp to the filename to avoid duplicates
  }
});

// Create the multer upload instance with the storage configuration
const upload = multer({ storage });

// Export the upload instance to be used in other parts of the app
export default upload;
