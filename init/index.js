
const mongoose = require("mongoose");
 const initData = require("./data.js");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("connected to DB");
})

.catch((err) => {
console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({}); // Clear the collection

    // Map over the data to preprocess the image field and add the owner field
    const formattedData = initData.data.map(item => ({
        ...item,
        image: typeof item.image === "string" 
            ? item.image 
            : (item.image?.url || "https://unsplash.com/photos/a-body-of-water-surrounded-by-trees-and-a-bridge-EQ4PAyhhhkM"),
        owner: '67ed9b9f67ed92996022dde0'
    }));



    await Listing.insertMany(formattedData); // Insert the preprocessed data
    console.log("Data was initialized");
};


initDB();