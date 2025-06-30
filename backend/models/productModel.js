import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    images: { type: [String], required: false },
    weight: { type: String, required: true }
}, { timestamps: true });

const productModel = mongoose.model('Product', productSchema);

export default productModel;
