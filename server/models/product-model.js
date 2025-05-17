const mongoose = require('mongoose')
const { Schema, model } = mongoose

const ReviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
})

const ColorVariantSchema = new Schema({
    color: { type: String, required: true },
    price: { type: Number, required: true },
    images: [String],
    sizes: [String]
})

const ProductSchema = new Schema({
    name: { type: String, required: true },
    variants: [ColorVariantSchema],
    reviews: [ReviewSchema],
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
})

module.exports = model('Product', ProductSchema)