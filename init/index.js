const mongoose = require("mongoose");
const intiData = require("./data.js")
const listing = require("../models/listings.js")
let MONGOOSE_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => console.log("Connect to the DB")).catch(err => console.log(err));
async function main() {
    await mongoose.connect(MONGOOSE_URL)
}

let dbdata = async () => {
    await listing.deleteMany({});
    await listing.insertMany(intiData.data);
    console.log("Data Saved")
}

// dbdata();