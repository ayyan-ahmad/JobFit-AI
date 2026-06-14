const mongoose = require("mongoose");

// DB Connect
async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected Successfully");
    }
    catch (err) {
        console.log("DB Connection Failed", err);
    }
}
module.exports = connectToDB;