import MessageRepository from "../repositories/message.repository.js";

class ChatController {

    static async sendMessage(req, res) {
        try {
            const { workspace_id } = req.params;
            const { content } = req.body;

            const user_id = req.user.id; // viene del token

            const message = await MessageRepository.create(
                workspace_id,
                user_id,
                content
            );

            res.send({
                ok: true,
                message
            });

        } catch (error) {
            console.log(error);
            res.status(500).send({ ok: false, error });
        }
    }

    static async getMessages(req, res) {
        try {
            const { workspace_id } = req.params;
            const messages = await MessageRepository.getByWorkspace(workspace_id);

            res.send({
                ok: true,
                messages
            });

        } catch (error) {
            console.log(error);
            res.status(500).send({ ok: false, error });
        }
    }
}

export default ChatController;
