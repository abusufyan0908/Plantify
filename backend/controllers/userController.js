import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";
import User from "../models/userModel.js";

// Route for user login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Create user data object without password
    const userData = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role
    };

    // Send both token and user data
    res.status(200).json({ 
      success: true, 
      token,
      user: userData
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Error logging in user" });
  }
};

// Route for user registration
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    // Save the user to the database
    await newUser.save();

    // Return user without password
    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    res.status(201).json({ success: true, user: userToReturn });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
};

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Find or create admin user
      let adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
      
      if (!adminUser) {
        // Create admin user if doesn't exist
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
        adminUser = await User.create({
          username: 'Admin',
          email: process.env.ADMIN_EMAIL,
          password: hashedPassword,
          role: 'admin'
        });
      }

      const token = jwt.sign({ 
        userId: adminUser._id,
        email: adminUser.email,
        role: 'admin'
      }, process.env.JWT_SECRET, { 
        expiresIn: '1h' 
      });
      
      res.json({ 
        success: true, 
        token,
        user: {
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role
        }
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: "Invalid admin credentials" 
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error during admin login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Error fetching user profile' });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

// Get single user
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Error fetching user' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const updateData = { username, email, role };
    
    // Only hash and update password if it's provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Error updating user' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
};

// Verify token and get user data
export const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Ensure we're sending back the user ID
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ success: false, message: 'Error verifying token' });
  }
};
  