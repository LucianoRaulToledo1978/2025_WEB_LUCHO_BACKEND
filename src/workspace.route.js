import express from "express";
import authMiddleware from "./auth.middleware.js";
import WorkspaceController from "./workspace.controller.js";
import workspaceMiddleware from "./workspace.middleware.js";

const workspace_router = express.Router();

// Todas las rutas requieren autenticación
workspace_router.use(authMiddleware);

// Obtener todos los workspaces
workspace_router.get("/", WorkspaceController.getAll);

// Obtener un workspace por ID
workspace_router.get("/:workspace_id", WorkspaceController.getById);

// Invitar usuario (solo admin)
workspace_router.post(
    "/:workspace_id/invite",
    workspaceMiddleware(["admin"]),
    WorkspaceController.inviteMember
);

// Crear un nuevo workspace
workspace_router.post("/", WorkspaceController.post);

export default workspace_router;
