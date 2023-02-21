import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required:true,
    },
    userId: {
        type: String,
        required:true
    }
}, { timestamps: true });

const NodeModel = mongoose.model("node", nodeSchema);

export default NodeModel;