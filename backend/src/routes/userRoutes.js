import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

router.post("/login", (req, res) => UserController.loginUser(req, res));

export default router;
