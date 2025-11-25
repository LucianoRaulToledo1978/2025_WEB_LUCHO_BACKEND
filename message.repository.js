import MessageModel from "../models/message.model.js";

class MessageRepository {

    static async create(workspace_id, user_id, content) {
        const message = await MessageModel.create({
            workspace_id,
            user_id,
            content
        });
        return message;
    }

    static async getByWorkspace(workspace_id) {
        return MessageModel
            .find({ workspace_id })
            .populate("user_id", "name email") // opcional
            .sort({ created_at: 1 });
    }
}

export default MessageRepository;
