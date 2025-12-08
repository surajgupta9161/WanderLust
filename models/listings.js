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
        type: String,
        default: "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
        set: (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687" : v
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
    ]

});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})

let listing = mongoose.model("Listing", listingSchema);

module.exports = listing;