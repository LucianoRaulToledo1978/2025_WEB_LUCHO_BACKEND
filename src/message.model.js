import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    workspace_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const MessageModel = mongoose.model("Message", messageSchema);

export default MessageModel;
