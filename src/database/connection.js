import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const Connection = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env file");
        }

        if (mongoose.connection.readyState === 1) {
            console.log("Already connected to MongoDB.");
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB...");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

export default Connection;
