const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./joischema.js");
// const { SlowBuffer } = require("buffer");
const Review = require("./models/review.js");

app.listen(8080, () => {
    console.log("Listing By Port 8080");
})
let MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => console.log("Connect to the DB")).catch(err => console.log(err));
async function main() {
    await mongoose.connect(MONGOOSE_URL)
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")))


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message);
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message);
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}

app.get("/", (req, res) => {
    res.send("Home Route /");
})

//index route
app.get("/listings", wrapAsync(async (req, res) => {
    let allListings = await listing.find({});
    res.render("listings/index.ejs", { allListings })
}));

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { list });
}));

//Create route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    let newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit route

app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let editListing = await listing.findById(id);
    res.render("listings/edit.ejs", { editListing });
}))

app.put("/listing/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}))

//delete route

app.delete("/listing/:id/delete", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// app.all("/*", (req, res, next) => {
//     let { status = 500, message = "Page Not Found!!" } = err;
//     res.status(status).send(message);
// })

//reviews
//review route
app.post("/listings/:id/review", validateReview, wrapAsync(async (req, res) => {
    let revlisting = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    revlisting.reviews.push(newReview)
    await newReview.save();
    await revlisting.save();
    console.log("Review Added");
    res.redirect(`/listings/${revlisting.id}`)
}))

//Delete Review Route
app.delete("/listings/:id/review/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);

}))

app.use((req, res) => {
    res.status(404).render("listings/error.ejs", message = "Page Not Found");
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Somthing went wrong" } = err;
    res.status(status).render("listings/error.ejs", { message });
})

