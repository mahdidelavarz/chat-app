import { Router } from "express";

import { authenticateToken } from "../middleware/auth";
import { getUsers, login, register } from "../controller/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", authenticateToken, getUsers);

export default router;