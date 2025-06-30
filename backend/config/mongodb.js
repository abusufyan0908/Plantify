import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI + "/plantify");

    // Event listener for successful connection
    mongoose.connection.once("connected", () => {
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process with a failure code
  }
};

export default connectDB;
