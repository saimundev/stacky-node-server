import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required:true
    },
    profacation: {
        type: String
    },
    address: {
      type:String,  
    },
    image: {
        type:String
    },
    isVarefide: {
        default: false,
        type:Boolean
    }
})

const userModal = mongoose.model("User", userSchema);

export default userModal;