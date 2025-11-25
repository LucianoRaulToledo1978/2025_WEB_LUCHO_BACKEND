import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import ChatController from "./chat.controller.js";


const router = express.Router();

// Obtener mensajes del workspace
router.get("/:workspace_id", authMiddleware, ChatController.getMessages);

// Enviar un mensaje
router.post("/:workspace_id", authMiddleware, ChatController.sendMessage);

export default router;
