 const mongoose = require('mongoose');
 const initData = require('./data.js');
const Listing = require('../models/listings.js');

main()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  // await Listing.deleteMany({});
   initData.data = initData.data.map((obj)=>({...obj,owner:"6685fc82028f04567d93b421" }))
  await Listing.insertMany(initData.data);
  console.log("Database initialized with sample data");
};

initDB();
   