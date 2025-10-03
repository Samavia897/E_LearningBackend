const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const connectDB = async () => {
    try {
        // Use the MONGODB_URL from environment variables
        const mongoURI = process.env.MONGODB_URL;

        if (!mongoURI) {
            throw new Error('MongoDB URL is not defined in environment variables.');
        }

        await mongoose.connect(mongoURI, {
            // useNewUrlParser and useUnifiedTopology are no longer strictly required in Mongoose 6+
            // but can be kept for older versions or specific configurations.
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;