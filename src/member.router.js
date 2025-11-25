import express from "express";
import MemberController from "./member.controller.js";

const router = express.Router();

router.post("/", MemberController.create);
router.get("/:workspace_id", MemberController.getMembers);

export default router;
