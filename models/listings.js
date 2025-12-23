const { required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review.js")
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 4
    },
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    country: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})

let listing = mongoose.model("Listing", listingSchema);

module.exports = listing;