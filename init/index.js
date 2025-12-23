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
    intiData.data = intiData.data.map((obj) => ({ ...obj, owner: "693a675dfd630754d4fa71bb" }))
    await listing.insertMany(intiData.data);
    console.log("Data Saved")
}

dbdata();