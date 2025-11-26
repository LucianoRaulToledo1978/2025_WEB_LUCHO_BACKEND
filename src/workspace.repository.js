import Workspace from "./Workspace.models.js";

class WorkspacesRepository {

    static async createWorkspace(name, url_image, user_id) {
        const workspace = await Workspace.create({
            name,
            url_image,
            userId: user_id
        });

        return workspace._id;
    }

    static async getAll() {
        return await Workspace.find();
    }

    static async getById(workspace_id) {
        return await Workspace.findById(workspace_id);
    }

    static async deleteById(workspace_id) {
        await Workspace.findByIdAndDelete(workspace_id);
        return true;
    }

    static async updateById(workspace_id, new_values) {
        return await Workspace.findByIdAndUpdate(
            workspace_id,
            new_values,
            { new: true }
        );
    }

    static async getAllWorkspacesByUserId(userId) {
        return await Workspace.find({ userId });
    }
}

export default WorkspacesRepository;
