import mongoose from "mongoose";

export const connectDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (err:any) {
        console.log(`MongoDB Connectin Error: ${err.message}`);
        process.exit(1); // 1 is the failure, 0 is the success
    }   
};