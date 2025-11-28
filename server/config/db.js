import mongoose from "mongoose";

//function to connect to the database
const connectDB = async () => {
    mongoose.connection.on('connected',() => console.log("Database Connected"))
    await mongoose.connect(`${process.env.MONGODB_URI}/hirehub`)
}

export default connectDB;