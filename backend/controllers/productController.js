import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import mongoose from 'mongoose';

// Add product
const addProduct = async (req, res) => {
    try {
        const { name, description, subCategory, price, category, quantity, weight } = req.body;

        if (!category) {
            return res.status(400).json({ success: false, message: "Category is required" });
        }

        if (quantity === undefined || isNaN(quantity) || quantity < 0) {
            return res.status(400).json({ success: false, message: "Valid quantity is required" });
        }

        const files = req.files || {};
        const images = [
            files.image1 ? files.image1[0] : null,
            files.image2 ? files.image2[0] : null,
            files.image3 ? files.image3[0] : null
        ].filter((item) => item !== null);

        // Initialize an array to store image URLs
        let imagesUrl = [];

        // If images are provided, upload them to Cloudinary
        if (images.length > 0) {
            imagesUrl = await Promise.all(
                images.map(async (item) => {
                    try {
                        const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                        return result.secure_url;
                    } catch (uploadError) {
                        console.error('Cloudinary upload failed for', item.originalname, uploadError);
                        throw uploadError;
                    }
                })
            );
        }

        // Construct product data
        const productData = {
            name,
            description,
            category,
            subCategory,
            price: Number(price),
            quantity: Number(quantity),
            images: imagesUrl,
            weight
        };

        // Save product data to the database
        const product = new productModel(productData);
        await product.save();

        // Respond with success message
        res.json({
            success: true,
            message: 'Product added successfully',
        });

    } catch (error) {
        console.error('Error occurred during addProduct:', error);
        res.status(400).json({ success: false, message: 'Something went wrong' });
    }
};

// List all products
const listProduct = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await productModel.find({});

        // If no products are found, return a different response
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found" });
        }

        // Send response with products
        res.status(200).json({ success: true, products });
    } catch (error) {
        // Log the error and return a failure message
        console.error('Error occurred while fetching products:', error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

// Remove a product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: 'Failed to remove product' });
    }
};

// Get a single product
const singleProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if the id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid product ID format' 
            });
        }

        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        // Validate product data
        if (!product.name || !product.price) {
            return res.status(500).json({ 
                success: false, 
                message: 'Invalid product data in database' 
            });
        }

        res.json({ 
            success: true, 
            product: {
                _id: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                category: product.category,
                subCategory: product.subCategory,
                images: product.images || [],
                weight: product.weight,
                quantity: product.quantity
            }
        });
    } catch (error) {
        console.error('Error in singleProduct:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to retrieve product',
            error: error.message 
        });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Product ID from the URL
        const { name, description, subCategory, bestseller, price, category, quantity, weight } = req.body;
        const files = req.files || {};
        const images = [
            files.image1 ? files.image1[0] : null,
            files.image2 ? files.image2[0] : null,
            files.image3 ? files.image3[0] : null
        ].filter((item) => item !== null);

        // Initialize an array to store image URLs
        let imagesUrl = [];

        // If images are provided, upload them to Cloudinary
        if (images.length > 0) {
            imagesUrl = await Promise.all(
                images.map(async (item) => {
                    try {
                        const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                        return result.secure_url;
                    } catch (uploadError) {
                        console.error('Cloudinary upload failed for', item.originalname, uploadError);
                        throw uploadError;
                    }
                })
            );
        }

        // Find the product by ID and update it
        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            {
                name,
                description,
                category,
                subCategory,
                bestseller: bestseller === 'true',
                price: Number(price),
                quantity: Number(quantity),
                images: imagesUrl.length > 0 ? imagesUrl : undefined, // Only update images if new ones are provided
                weight,
            },
            { new: true } // Return the updated product
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error('Error occurred during updateProduct:', error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};

export { addProduct, listProduct, removeProduct, singleProduct, updateProduct };
