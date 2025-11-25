import express from 'express'
import WorkspacesRepository from '../repositories/workspace.repository.js'
import { validarId } from '../utils/validations.utils.js'
import { ServerError } from '../utils/customError.utils.js'
import WorkspaceController from '../controllers/workspace.controller.js'
import authMiddleware, { authByRoleMiddleware } from '../middleware/auth.middleware.js'
import workspaceMiddleware from '../middleware/workspace.middleware.js'
//Manejar consultas referidas a workspace

const workspace_router = express.Router()

//Configuracion a nivel de ruta
workspace_router.use(authMiddleware)



workspace_router.get('/', WorkspaceController.getAll )

// workspace_router.get('/:workspace_id', /* authByRoleMiddleware(['admin']), */  WorkspaceController.getById )

workspace_router.post(
    '/:workspace_id/invite', 
    workspaceMiddleware(['admin']),
    WorkspaceController.inviteMember
)


workspace_router.get('/:workspace_id', WorkspaceController.getById )

//Crear el WorkspaceController con los metodos .post, .getById, getAll

//Este es el endpoint para crear workspaces
workspace_router.post('/', WorkspaceController.post)




export default workspace_router