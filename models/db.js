import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        await mongoose.connect("mongodb+srv://stacky-node:xL20eMyNqohkDHUS@cluster0.d2pawnh.mongodb.net/node?retryWrites=true&w=majority");      
        console.log("db Connect successfull");
    } catch (error) {
        console.log(error.message)
    }
}

export default dbConnect;