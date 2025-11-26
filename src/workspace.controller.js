//Las funciones que se encargaran de manejar la consulta y la respuesta

import WorkspacesRepository from "./workspace.repository.js";
import { ServerError } from "./customError.utils.js";
import { validarId } from "./validations.utils.js";
import ENVIRONMENT from "./environment.config.js";
import transporter from "./mailer.config.js";
import UserRepository from "./user.repository.js";
import jwt from "jsonwebtoken";
import MemberWorkspaceRepository from "./memberWorkspace.repository.js";

class WorkspaceController {

    static async getAll(req, res) {
        try {
            const workspaces = await WorkspacesRepository.getAllWorkspacesByUserId(req.user.id);

            return res.json({
                status: "OK",
                message: "Lista de espacios obtenida correctamente",
                data: { workspaces }
            });
        } catch (error) {
            console.log(error);
            const status = error.status || 500;
            return res.status(status).json({
                ok: false,
                status,
                message: error.message || "Error interno del servidor"
            });
        }
    }

    static async getById(req, res) {
        try {
            const workspace_id = req.params.workspace_id;

            if (!validarId(workspace_id)) {
                throw new ServerError(400, "El workspace_id debe ser válido");
            }

            const workspace = await WorkspacesRepository.getById(workspace_id);

            if (!workspace) {
                throw new ServerError(404, `Workspace con id ${workspace_id} no encontrado`);
            }

            return res.json({
                ok: true,
                message: "Workspace obtenido",
                data: { workspace }
            });

        } catch (error) {
            console.log(error);
            const status = error.status || 500;
            return res.status(status).json({
                ok: false,
                status,
                message: error.message || "Error interno del servidor"
            });
        }
    }

    static async post(req, res) {
        try {
            const { name } = req.body;

            if (!name || typeof name !== "string" || name.length > 30) {
                throw new ServerError(
                    400,
                    "El campo 'name' debe ser un string de menos de 30 caracteres"
                );
            }

            const workspace_id = await WorkspacesRepository.createWorkspace(
                name,
                null,
                req.user.id
            );

            if (!workspace_id) throw new ServerError(500, "Error al crear workspace");

            await MemberWorkspaceRepository.create(req.user.id, workspace_id, "admin");

            return res.status(201).json({
                ok: true,
                status: 201,
                message: "Workspace creado con éxito"
            });

        } catch (error) {
            console.log(error);
            const status = error.status || 500;
            return res.status(status).json({
                ok: false,
                status,
                message: error.message || "Error interno del servidor"
            });
        }
    }

    static async inviteMember(req, res) {
        try {
            const { workspace, user } = req;
            const { invited_email } = req.body;

            const user_invited = await UserRepository.getByEmail(invited_email);
            if (!user_invited) throw new ServerError(404, "Usuario no encontrado");

            const member_data = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(
                user_invited._id,
                workspace._id
            );

            if (member_data) {
                throw new ServerError(
                    409,
                    `El usuario ${invited_email} ya es miembro del workspace`
                );
            }

            const invite_token = jwt.sign(
                {
                    id_invited: user_invited._id,
                    email_invited: invited_email,
                    id_workspace: workspace._id,
                    id_inviter: user.id
                },
                ENVIRONMENT.JWT_SECRET_KEY,
                { expiresIn: "7d" }
            );

            // Ruta correcta (NO /api/members)
            const invitation_url = `${ENVIRONMENT.URL_API_BACKEND}/api/member/confirm-invitation/${invite_token}`;

            await transporter.sendMail({
                from: ENVIRONMENT.GMAIL_USERNAME,
                to: invited_email,
                subject: "Invitación al workspace",
                html: `
                    <h1>${user.email} te invitó al workspace ${workspace.name}</h1>
                    <a href='${invitation_url}'>Haz clic para aceptar</a>
                `
            });

            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Usuario invitado con éxito"
            });

        } catch (error) {
            console.log(error);
            const status = error.status || 500;
            return res.status(status).json({
                ok: false,
                status,
                message: error.message || "Error interno del servidor"
            });
        }
    }
}

export default WorkspaceController;
